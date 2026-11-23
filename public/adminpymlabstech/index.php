<?php
/** PYMLABS admin: website visits and WhatsApp-button clicks. */
declare(strict_types=1);

require __DIR__ . '/lib.php';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
session_name('pymadmin');
session_set_cookie_params(['lifetime' => 0, 'path' => '/adminpymlabstech', 'secure' => $https,
    'httponly' => true, 'samesite' => 'Strict']);
session_start();

$configured = is_file(__DIR__ . '/config.php');
if ($configured) {
    require __DIR__ . '/config.php';
}

function h($v): string
{
    return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
}

const PAGE_NAMES = ['/' => 'Home', '/about/' => 'About', '/services/' => 'Services', '/solutions/' => 'Solutions',
    '/portfolio/' => 'Portfolio', '/contact/' => 'Contact', '/privacy-policy/' => 'Privacy policy',
    '/terms-and-conditions/' => 'Terms', '/404.html' => 'Page not found'];

function page_name(string $p): string
{
    return PAGE_NAMES[$p] ?? $p;
}

function ist(int $ts, string $fmt): string
{
    return gmdate($fmt, $ts + 19800);
}

function duration(int $sec): string
{
    if ($sec < 60) {
        return $sec . 's';
    }
    return floor($sec / 60) . 'm ' . ($sec % 60) . 's';
}

function n($v): string
{
    return number_format((int)$v);
}

/* ---- login throttling: 5 wrong attempts per 15 minutes per network address ---- */
const THROTTLE_FILE = STATS_DIR . '/login.php';

function throttle_key(): string
{
    return substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . (defined('ADMIN_SALT') ? ADMIN_SALT : '')), 0, 16);
}

function throttle_read(): array
{
    if (!is_file(THROTTLE_FILE)) {
        return [];
    }
    $raw = (string)file_get_contents(THROTTLE_FILE);
    $data = json_decode(substr($raw, (int)strpos($raw, "\n") + 1), true);
    return is_array($data) ? $data : [];
}

function throttle_write(array $d): void
{
    stats_dir_ready();
    $now = time();
    $d = array_filter($d, static fn($e) => $now - $e[1] < 900);
    @file_put_contents(THROTTLE_FILE, STATS_GUARD . json_encode($d), LOCK_EX);
}

function throttled(): bool
{
    $e = throttle_read()[throttle_key()] ?? null;
    return $e && $e[0] >= 5 && time() - $e[1] < 900;
}

/* ---- actions ---- */
$_SESSION['csrf'] ??= bin2hex(random_bytes(16));
$error = '';
$action = $_POST['action'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''))) {
        $error = 'Your session expired. Please try again.';
    } elseif ($action === 'login' && $configured) {
        if (throttled()) {
            $error = 'Too many wrong attempts. Try again in 15 minutes.';
        } else {
            $user = (string)($_POST['username'] ?? '');
            $pass = (string)($_POST['password'] ?? '');
            $ok = hash_equals(ADMIN_USER, $user)
                & hash_equals(ADMIN_HASH, hash_pbkdf2('sha256', $pass, ADMIN_SALT, ADMIN_ITERATIONS));
            if ($ok) {
                session_regenerate_id(true);
                $_SESSION['admin'] = true;
                $_SESSION['since'] = time();
                $_SESSION['csrf'] = bin2hex(random_bytes(16));
                $t = throttle_read();
                unset($t[throttle_key()]);
                throttle_write($t);
                header('Location: ./', true, 303);
                exit;
            }
            $t = throttle_read();
            $k = throttle_key();
            $t[$k] = isset($t[$k]) && time() - $t[$k][1] < 900 ? [$t[$k][0] + 1, $t[$k][1]] : [1, time()];
            throttle_write($t);
            usleep(800000);
            $error = 'Wrong username or password.';
        }
    } elseif ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: ./', true, 303);
        exit;
    }
}

$loggedIn = !empty($_SESSION['admin']) && time() - (int)($_SESSION['since'] ?? 0) < 8 * 3600;
if (!$loggedIn) {
    unset($_SESSION['admin']);
}

/* ---- data for the dashboard ---- */
if ($loggedIn) {
    $s = stats_load();
    $today = gmdate('Y-m-d', time() + 19800);
    $sum = static function (array $days, int $n, string $k) use ($today): int {
        $t = 0;
        for ($i = 0; $i < $n; $i++) {
            $d = gmdate('Y-m-d', strtotime($today . ' 12:00:00 UTC') - $i * 86400);
            $t += (int)($days[$d][$k] ?? 0);
        }
        return $t;
    };
    $periods = [
        'Today' => 1,
        'Last 7 days' => 7,
        'Last 30 days' => 30,
    ];
    $rows = [];
    for ($i = 0; $i < 30; $i++) {
        $d = gmdate('Y-m-d', strtotime($today . ' 12:00:00 UTC') - $i * 86400);
        $rows[$d] = $s['days'][$d] ?? ['views' => 0, 'visitors' => 0, 'wa' => 0];
    }
    $maxViews = max(1, ...array_map(static fn($r) => (int)$r['views'], array_values($rows)));
    foreach (PAGE_NAMES as $path => $_) {
        if ($path !== '/404.html') {
            $s['pages'][$path] = $s['pages'][$path] ?? 0;   // list every page, even with no visits yet
        }
    }
    arsort($s['pages']);
    arsort($s['wa_sources']);
    arsort($s['wa_pages']);
    arsort($s['referrers']);
    $visits = $s['visits'];
    uasort($visits, static fn($a, $b) => $b['start'] <=> $a['start']);
    $visits = array_slice($visits, 0, 100, true);
    $labels = ['floating' => 'Floating button (every page)', 'contact' => 'Contact page', 'footer' => 'Footer link'];
}
?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>PYMLABS Admin</title>
<style>
:root{--bg:#f4f6fa;--card:#fff;--ink:#141b2d;--muted:#5b6478;--line:#e3e7ef;--brand:#1f2a44;--wa:#1faa59;--bar:#3b5bdb}
@media (prefers-color-scheme:dark){:root{--bg:#0f1422;--card:#171e30;--ink:#e8ecf5;--muted:#9aa4ba;--line:#273049;--brand:#8fa8ff;--wa:#3ddc84;--bar:#6d8bff}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:1080px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px}
h1{font-size:20px;margin:0}h2{font-size:16px;margin:0 0 12px}
.muted{color:var(--muted);font-size:13px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:12px}
.kpi .v{font-size:32px;font-weight:700;font-variant-numeric:tabular-nums}.kpi .l{color:var(--muted);font-size:13px}
.kpi.wa .v{color:var(--wa)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;margin-top:12px}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
th,td{text-align:left;padding:7px 6px;border-bottom:1px solid var(--line);font-size:14px}th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
td.num,th.num{text-align:right}td.d{white-space:nowrap}
.path{display:flex;flex-wrap:wrap;gap:4px;align-items:center}.chip{background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:1px 9px;font-size:13px;white-space:nowrap}.arrow{color:var(--muted);font-size:12px}.chip.wa{background:var(--wa);border-color:var(--wa);color:#fff}
.tag{font-size:12px;color:var(--muted)}
.bar{height:8px;border-radius:4px;background:var(--bar);min-width:2px}
button,.btn{font:inherit;border:0;border-radius:10px;padding:10px 16px;background:var(--brand);color:#fff;cursor:pointer}
@media (prefers-color-scheme:dark){button,.btn{color:#0f1422}}
.ghost{background:transparent;color:var(--ink);border:1px solid var(--line)}
.login{max-width:360px;margin:12vh auto}
label{display:block;font-size:13px;color:var(--muted);margin:12px 0 4px}
input{width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg);color:var(--ink)}
.err{background:#fde8e8;color:#9b1c1c;border-radius:10px;padding:10px 12px;margin-top:12px;font-size:14px}
.period{display:grid;grid-template-columns:1fr repeat(3,auto);gap:6px 18px;font-variant-numeric:tabular-nums}
.period div{padding:4px 0;border-bottom:1px solid var(--line)}
.scroll{overflow-x:auto}
</style>
</head>
<body>
<div class="wrap">
<?php if (!$configured): ?>
  <div class="card login"><h1>Admin not configured</h1><p class="muted">config.php is missing on the server.</p></div>
<?php elseif (!$loggedIn): ?>
  <form class="card login" method="post" autocomplete="on">
    <h1>PYMLABS Admin</h1>
    <p class="muted">Sign in to see website visits and WhatsApp clicks.</p>
    <input type="hidden" name="action" value="login">
    <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
    <label for="u">Username</label>
    <input id="u" name="username" required autocomplete="username" autofocus>
    <label for="p">Password</label>
    <input id="p" name="password" type="password" required autocomplete="current-password">
    <?php if ($error): ?><div class="err" role="alert"><?= h($error) ?></div><?php endif; ?>
    <p><button type="submit" style="width:100%;margin-top:8px">Sign in</button></p>
  </form>
<?php else: ?>
  <header>
    <div>
      <h1>PYMLABS website stats</h1>
      <div class="muted">Counting since <?= h($s['since']) ?> · times in India time · updated live</div>
    </div>
    <form method="post">
      <input type="hidden" name="action" value="logout">
      <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
      <a class="btn ghost" href="./">Refresh</a> <button class="ghost" type="submit">Log out</button>
    </form>
  </header>

  <div class="kpis">
    <div class="card kpi"><div class="v"><?= n($s['total']['visitors']) ?></div><div class="l">Unique visitors (all time)</div></div>
    <div class="card kpi"><div class="v"><?= n($s['total']['views']) ?></div><div class="l">Page views (all time)</div></div>
    <div class="card kpi wa"><div class="v"><?= n($s['total']['wa']) ?></div><div class="l">WhatsApp button clicks (all time)</div></div>
    <?php $vc = count($s['visits']); $vw = count(array_filter($s['visits'], static fn($v) => !empty($v['wa']))); ?>
    <div class="card kpi"><div class="v"><?= $vc ? h(round($vw * 100 / $vc)) . '%' : '–' ?></div><div class="l">Visits that clicked WhatsApp (<?= n($vw) ?> of <?= n($vc) ?>)</div></div>
  </div>

  <div class="card">
    <h2>By period</h2>
    <div class="period">
      <div class="muted"></div><div class="muted">Visitors</div><div class="muted">Page views</div><div class="muted">WhatsApp clicks</div>
      <?php foreach ($periods as $label => $days): ?>
        <div><?= h($label) ?></div>
        <div><?= n($sum($s['days'], $days, 'visitors')) ?></div>
        <div><?= n($sum($s['days'], $days, 'views')) ?></div>
        <div><?= n($sum($s['days'], $days, 'wa')) ?></div>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="grid">
    <div class="card scroll">
      <h2>Last 30 days</h2>
      <table>
        <tr><th>Date</th><th class="num">Visitors</th><th class="num">Views</th><th class="num">WhatsApp</th><th style="width:30%"></th></tr>
        <?php foreach ($rows as $d => $r): ?>
          <tr>
            <td class="d"><?= h(date('D j M', strtotime($d))) ?></td>
            <td class="num"><?= n($r['visitors']) ?></td>
            <td class="num"><?= n($r['views']) ?></td>
            <td class="num"><?= n($r['wa']) ?></td>
            <td><div class="bar" style="width:<?= h(round((int)$r['views'] * 100 / $maxViews)) ?>%"></div></td>
          </tr>
        <?php endforeach; ?>
      </table>
    </div>

    <div>
      <div class="card">
        <h2>WhatsApp clicks by button</h2>
        <table>
          <?php if (!$s['wa_sources']): ?><tr><td class="muted">No clicks yet.</td></tr><?php endif; ?>
          <?php foreach ($s['wa_sources'] as $k => $v): ?>
            <tr><td><?= h($labels[$k] ?? $k) ?></td><td class="num"><?= n($v) ?></td></tr>
          <?php endforeach; ?>
        </table>
      </div>
      <div class="card" style="margin-top:12px">
        <h2>WhatsApp clicks by page</h2>
        <table>
          <?php if (!$s['wa_pages']): ?><tr><td class="muted">No clicks yet.</td></tr><?php endif; ?>
          <?php foreach (array_slice($s['wa_pages'], 0, 10, true) as $k => $v): ?>
            <tr><td><?= h(page_name((string)$k)) ?></td><td class="num"><?= n($v) ?></td></tr>
          <?php endforeach; ?>
        </table>
      </div>
      <div class="card" style="margin-top:12px">
        <h2>Devices (unique visitors)</h2>
        <table>
          <tr><td>Mobile</td><td class="num"><?= n($s['devices']['mobile'] ?? 0) ?></td></tr>
          <tr><td>Desktop</td><td class="num"><?= n($s['devices']['desktop'] ?? 0) ?></td></tr>
        </table>
      </div>
    </div>

    <div class="card">
      <h2>Most viewed pages</h2>
      <table>
        <?php if (!$s['pages']): ?><tr><td class="muted">No visits yet.</td></tr><?php endif; ?>
        <?php foreach (array_slice($s['pages'], 0, 20, true) as $k => $v): ?>
          <tr><td><?= h(page_name((string)$k)) ?></td><td class="num"><?= n($v) ?></td></tr>
        <?php endforeach; ?>
      </table>
    </div>

    <div class="card">
      <h2>Where visitors came from</h2>
      <table>
        <?php if (!$s['referrers']): ?><tr><td class="muted">No outside links yet (direct visits are not listed).</td></tr><?php endif; ?>
        <?php foreach (array_slice($s['referrers'], 0, 15, true) as $k => $v): ?>
          <tr><td><?= h($k) ?></td><td class="num"><?= n($v) ?></td></tr>
        <?php endforeach; ?>
      </table>
    </div>
  </div>
  <div class="card scroll" style="margin-top:12px">
    <h2>Recent visits: pages each visitor opened</h2>
    <p class="muted" style="margin-top:-6px">Newest first, last 100 visits. One row is one visit (one browser tab).</p>
    <table>
      <tr><th>When</th><th>Visitor</th><th>Pages visited, in order</th><th class="num">Time on site</th></tr>
      <?php if (!$visits): ?><tr><td colspan="4" class="muted">No visits recorded yet.</td></tr><?php endif; ?>
      <?php foreach ($visits as $v): ?>
        <tr>
          <td class="d"><?= h(ist((int)$v['start'], 'j M, g:i a')) ?></td>
          <td class="d"><?= $v['new'] ? 'New' : 'Returning' ?><br><span class="tag"><?= h($v['dev']) ?><?= $v['ref'] !== '' ? ' · from ' . h($v['ref']) : '' ?></span></td>
          <td><div class="path">
            <?php foreach ($v['pages'] as $i => $p): ?>
              <?php if ($i): ?><span class="arrow">→</span><?php endif; ?>
              <span class="chip"><?= h(page_name((string)$p[0])) ?></span>
            <?php endforeach; ?>
            <?php foreach ($v['wa'] as $w): ?>
              <span class="arrow">→</span><span class="chip wa">WhatsApp<?= isset(['floating'=>1,'contact'=>1,'footer'=>1][$w[0]]) ? ' · ' . h(['floating'=>'floating button','contact'=>'contact page','footer'=>'footer'][$w[0]]) : '' ?></span>
            <?php endforeach; ?>
          </div></td>
          <td class="num d"><?= h(duration((int)$v['last'] - (int)$v['start'])) ?></td>
        </tr>
      <?php endforeach; ?>
    </table>
  </div>
  <p class="muted" style="margin-top:16px">Counts are anonymous: no IP addresses or personal data are stored. Search-engine bots are not counted.</p>
<?php endif; ?>
</div>
</body>
</html>
