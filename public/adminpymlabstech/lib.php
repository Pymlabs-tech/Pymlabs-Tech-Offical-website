<?php
/** Shared storage for the visit counter and the admin page. */
declare(strict_types=1);

if (realpath((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    http_response_code(404);
    exit;
}

const STATS_DIR = __DIR__ . '/../pymlabs-data';
const STATS_FILE = STATS_DIR . '/stats.php';
const STATS_GUARD = "<?php http_response_code(404); exit; ?>\n";

function stats_default(): array
{
    return [
        'since' => gmdate('Y-m-d', time() + 19800),
        'total' => ['views' => 0, 'visitors' => 0, 'wa' => 0],
        'days' => [],
        'pages' => [],
        'wa_sources' => [],
        'wa_pages' => [],
        'referrers' => [],
        'devices' => ['mobile' => 0, 'desktop' => 0],
        'visits' => [],
    ];
}

function stats_dir_ready(): void
{
    if (!is_dir(STATS_DIR)) {
        @mkdir(STATS_DIR, 0755, true);
    }
    $ht = STATS_DIR . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "Require all denied\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    }
    if (!is_file(STATS_DIR . '/index.html')) {
        @file_put_contents(STATS_DIR . '/index.html', '');
    }
}

function stats_decode(string $raw): array
{
    $json = strncmp($raw, "<?php", 5) === 0 ? substr($raw, strpos($raw, "\n") + 1) : $raw;
    $data = json_decode($json, true);
    return is_array($data) ? array_replace_recursive(stats_default(), $data) : stats_default();
}

function stats_load(): array
{
    if (!is_file(STATS_FILE)) {
        return stats_default();
    }
    return stats_decode((string)file_get_contents(STATS_FILE));
}

/** Read-modify-write under an exclusive lock so simultaneous visits are not lost. */
function stats_update(callable $fn): void
{
    stats_dir_ready();
    $fh = @fopen(STATS_FILE, 'c+');
    if (!$fh) {
        return;
    }
    try {
        if (!flock($fh, LOCK_EX)) {
            return;
        }
        $raw = stream_get_contents($fh);
        $s = $fn(stats_decode((string)$raw));
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, STATS_GUARD . json_encode($s, JSON_UNESCAPED_SLASHES));
        fflush($fh);
        flock($fh, LOCK_UN);
    } finally {
        fclose($fh);
    }
}
