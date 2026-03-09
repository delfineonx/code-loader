// Code Loader v2026-03-09-0001
// Interruption Framework v2026-03-01-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

const configuration = {
EVENTS: [
"tick",
"onPlayerJoin",
"onPlayerLeave",
"playerCommand",
"onPlayerChat",
"onPlayerJump",
"onPlayerClick",
/*
"tick",
["onPlayerJoin", 1],
["onPlayerLeave", 1],
"playerCommand",
["onPlayerChat", 0, null],
["onPlayerJump", 1],
"onPlayerClick",
*/
],
BLOCKS: [
// [6, 25, 6],
// [27, 4, 25],
[27, 4, 23],
[27, 4, 21],
[27, 4, 19],
[27, 4, 17],
[27, 4, 14],
[27, 4, 12],
[27, 4, 10],
[27, 4, 8],
[27, 4, 6],
],
OM: {
show_boot_status: true,
show_errors: true,
show_execution_info: false,
globals_to_keep: [],
},
BM: {
is_chest_mode: false, //
execution_budget_per_tick: 8, //
max_error_count: 32,
},
JM: {
dequeue_budget_per_tick: 8,
players_to_skip: [],
},
STYLES: [
"#FF775E", "500", "0.95rem",
"#FFC23D", "500", "0.95rem",
"#20DD69", "500", "0.95rem",
"#52B2FF", "500", "0.95rem",
],
};