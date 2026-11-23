<?php
/**
 * Anonymous visit and WhatsApp-click counter for the PYMLABS website.
 * Stores only counts: no IP addresses, no cookies, no personal data.
 * Called by the site with navigator.sendBeacon (text/plain JSON body).
 */
declare(strict_types=1);

require __DIR__ . '/../adminpymlabstech/lib.php';

header('Content-Type: application/json');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit('{"ok":false}');
}

$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|curl|wget|python|scrapy|facebookexternalhit|whatsapp/i', $ua)) {
    exit('{"ok":true}');
}

$body = file_get_contents('php://input', false, null, 0, 4096);
$in = json_decode((string)$body, true);
if (!is_array($in)) {
    http_response_code(400);
    exit('{"ok":false}');
}

$type = (string)($in['t'] ?? '');
if (!in_array($type, ['view', 'wa'], true)) {
    http_response_code(400);
    exit('{"ok":false}');
}

$clean = static function ($v, int $max): string {
    $v = preg_replace('/[^\w\-\/\.#]/u', '', (string)$v) ?? '';
    return substr($v, 0, $max);
};

$path = $clean($in['p'] ?? '/', 80);
if ($path === '' || $path[0] !== '/') {
    $path = '/';
}
$source = $clean($in['s'] ?? 'unknown', 24);
$vid = substr(preg_replace('/[^a-z0-9]/', '', strtolower((string)($in['v'] ?? ''))) ?? '', 0, 16);
$now = time();
$isNew = !empty($in['n']);
$isNewToday = !empty($in['d']);
$mobile = (bool)preg_match('/Mobi|Android|iPhone|iPad/i', $ua);

$ref = '';
if (!empty($in['r']) && is_string($in['r'])) {
    $host = parse_url($in['r'], PHP_URL_HOST);
    $self = parse_url('https://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
    if (is_string($host) && $host !== '' && $host !== $self) {
        $ref = substr(preg_replace('/^www\./', '', strtolower($host)) ?? '', 0, 60);
    }
}

$day = gmdate('Y-m-d', time() + 19800); // India time (UTC+5:30)

stats_update(static function (array $s) use ($type, $path, $source, $isNew, $isNewToday, $mobile, $ref, $day, $vid, $now): array {
    $s['days'][$day] ??= ['views' => 0, 'visitors' => 0, 'wa' => 0];
    if ($type === 'view') {
        $s['total']['views']++;
        $s['days'][$day]['views']++;
        $s['pages'][$path] = ($s['pages'][$path] ?? 0) + 1;
        if ($isNew) {
            $s['total']['visitors']++;
            $s['devices'][$mobile ? 'mobile' : 'desktop'] = ($s['devices'][$mobile ? 'mobile' : 'desktop'] ?? 0) + 1;
        }
        if ($isNewToday) {
            $s['days'][$day]['visitors']++;
        }
        if ($ref !== '') {
            $s['referrers'][$ref] = ($s['referrers'][$ref] ?? 0) + 1;
        }
    } else {
        $s['total']['wa']++;
        $s['days'][$day]['wa']++;
        $s['wa_sources'][$source] = ($s['wa_sources'][$source] ?? 0) + 1;
        $s['wa_pages'][$path] = ($s['wa_pages'][$path] ?? 0) + 1;
    }
    // One entry per visit (browser tab): the pages in the order they were opened, and any WhatsApp clicks.
    if ($vid !== '') {
        if (!isset($s['visits'][$vid])) {
            $s['visits'][$vid] = ['start' => $now, 'last' => $now, 'dev' => $mobile ? 'Mobile' : 'Desktop',
                'new' => $isNew, 'ref' => $ref, 'pages' => [], 'wa' => []];
        }
        $v = &$s['visits'][$vid];
        $v['last'] = $now;
        if ($type === 'view') {
            $lastPage = end($v['pages']);
            if (count($v['pages']) < 60 && (!$lastPage || $lastPage[0] !== $path || $now - $lastPage[1] > 5)) {
                $v['pages'][] = [$path, $now];
            }
            if ($ref !== '' && $v['ref'] === '') {
                $v['ref'] = $ref;
            }
        } elseif (count($v['wa']) < 20) {
            $v['wa'][] = [$source, $path, $now];
        }
        unset($v);
        if (count($s['visits']) > 500) {
            uasort($s['visits'], static fn($a, $b) => $a['last'] <=> $b['last']);
            $s['visits'] = array_slice($s['visits'], -400, null, true);
        }
    }
    // Keep a year of daily rows and bounded referrer/page lists.
    if (count($s['days']) > 400) {
        ksort($s['days']);
        $s['days'] = array_slice($s['days'], -366, null, true);
    }
    foreach (['referrers', 'pages'] as $k) {
        if (count($s[$k]) > 200) {
            arsort($s[$k]);
            $s[$k] = array_slice($s[$k], 0, 150, true);
        }
    }
    return $s;
});

echo '{"ok":true}';
