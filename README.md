
<hr>

<div align="center">
  <h1>Code Loader</h1>
  <p>
    Extend and automatically execute your lobby code from <code>block data</code>.<br>
    Flexible loader API helps manage boot safety during non-atomic setup and source execution.<br>
    Includes built-in <a href="https://github.com/delfineonx/interruption-framework"><code>Interruption Framework</code></a> for optional interruption-safety of managed event calls.
  </p>
  <p>
    <a href="#installation"><kbd>Installation</kbd></a> &nbsp;•&nbsp;
    <a href="#usage-specifics"><kbd>Usage Specifics</kbd></a> &nbsp;•&nbsp;
    <a href="#api-methods"><kbd>API Methods</kbd></a> &nbsp;•&nbsp;
    <a href="#configuration"><kbd>Configuration</kbd></a> &nbsp;•&nbsp;
    <a href="#features"><kbd>Features</kbd></a> &nbsp;•&nbsp;
    <a href="#example"><kbd>Example</kbd></a> &nbsp;•&nbsp;
    <a href="#references"><kbd>References</kbd></a> &nbsp;•&nbsp;
    <a href="#license"><kbd>License</kbd></a>
  </p>
</div>

<hr>

<a id="installation"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📥 Installation 📥</b></code> ❯</h2>
    </div>
  </summary>

  <p>Paste the loader code into your actual <code>World Code</code> in full.</p>

  <h2>
    <a href="./src/code_loader_minified.js"><code><b>minified</b></code></a>
    &nbsp;OR&nbsp;
    <a href="./src/code_loader_original.js"><code><b>original</b></code></a>
  </h2>

  <p>The loader starts booting automatically on successful <code>world code init</code>.</p>

  <div align="left">
    <h3><code><b>! IMPORTANT !</b></code></h3>
  </div>

  <p>Directly below the loader, you may:</p>

  <ul>
    <li>define shared variables and helper functions, but <ins>do not assign</ins> event (Bloxd callback) handlers there; this is generally <ins>not recommended</ins>, especially with top-level <code>var</code> and <code>function</code> declarations, because they are hoisted and can end up in the loader's initial globals snapshot, so later boot-time globals cleanup will never be able to delete those</li>
    <li>use <code>CL.onStart</code> for almost-immediate boot-time setup or preprocessing close to <code>world code init</code>; this <ins>may include</ins> assignments to event (Bloxd callback) handlers</li>
  </ul>

  <p>However, the intended workflow is still to keep actual game logic in source blocks.</p>

</details>

<hr>

<a id="usage-specifics"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🧭 Usage Specifics 🧭</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Events</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Handler Assignment</b></code> ⊃</h4>
  </div>

  <ul>
    <li><code>✔️ eventName = (...args) =&gt; { ... };</code></li>
    <li><code>✔️ eventName = function (...args) { ... };</code></li>
    <li><code>✔️ eventName = function optionalName(...args) { ... };</code></li>
    <li><code>❌ function eventName(...args) { ... }</code></li>
  </ul>

  <p>At loader startup, wrapper functions for configured events (Bloxd callbacks) are created on <code>globalThis</code> under their event names, and the game captures their references on <code>world code init</code>. Later writes to the same global properties do not replace the originally captured wrappers themselves. Therefore, before the primary boot proceeds into the normal <code>_bootTick</code> flow, the loader redefines those properties as configurable accessors whose getter and setter work with internal handler references stored in closure state.</p>
  <p>Because of that, the intended pattern is to <ins>assign</ins> a function to the existing global property. A global function declaration follows different declaration-binding semantics and may <ins>redefine the property itself</ins> instead of using the loader-managed setter.</p>

  <div align="left">
    <h4>⊂ <code><b>Single Active Handler</b></code> ⊃</h4>
  </div>

  <p>Each managed event keeps only one active handler reference. The most recent assignment replaces the previous one.</p>

  <p>This keeps the runtime model simpler, reduces overhead, and makes reboot behavior easier to predict. Automatic handler merging can work in some designs, but it often makes game logic harder to reason about and harder to manage safely:</p>

  <ul>
    <li>return-value behavior can become ambiguous</li>
    <li>hot-swap logic is harder to control correctly</li>
    <li>interruption handling becomes more complex</li>
    <li>merged paths may duplicate logic or API calls, wasting TU budget and increasing the chance of interruptions</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Manual Dispatching</b></code> ⊃</h4>
  </div>

  <p>If needed, you can build your own dispatcher inside the loader-managed event handler.</p>

```js
if (globalThis.chatHooks == null) {
  globalThis.chatHooks = [];
}

chatHooks.push((playerId, chatMessage, channelName) => {
  // module A
});

chatHooks.push((playerId, chatMessage, channelName) => {
  // module B
});

onPlayerChat = (playerId, chatMessage, channelName) => {
  for (let i = 0; i < chatHooks.length; i++) {
    const result = chatHooks[i](playerId, chatMessage, channelName);
    if (result !== undefined) { return result; }
  }
};
```

  <hr>

  <div align="left">
    <h3>〔 <code><b>Scopes, Closures, Globals</b></code> 〕</h3>
  </div>

  <p>Configured source blocks are evaluated separately, not in one shared local scope.</p>

  <ul>
    <li><code>let</code> and <code>const</code> stay local to the source where they are declared</li>
    <li>functions defined there can still access those values later through <a href="https://javascript.info/closure"><code>closures</code></a></li>
    <li>other sources cannot access those locals directly</li>
  </ul>

  <p>If some state must be accessible from multiple sources, store it on the global object.</p>

  <p>Recommended patterns for cross-source shared state:</p>

  <ol>
    <li><code>globalThis.name = ...</code> — clearest and most explicit</li>
    <li><code>var name = ...</code> — global <a href="https://javascript.info/var">at top level</a>, but less explicit</li>
    <li><code>name = ...</code> — also global, but least safe and easiest to create accidentally</li>
  </ol>

  <hr>

  <div align="left">
    <h3>〔 <code><b>Boot Safety</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Boot Is Not Atomic</b></code> ⊃</h4>
  </div>

  <p>Boot unfolds across multiple ticks. During that time the loader may run its lifecycle callbacks, process join and leave events, reset handlers and globals, execute configured sources, and perform other steps before the environment becomes fully stable.</p>

  <p>Therefore, events can still fire while the game setup is incomplete. Some globals, helpers, or handlers may still be undefined during parts of the boot session, which can lead to bugs or hard failures.</p>

  <div align="left">
    <h4>⊂ <code><b>CL.stage Overview</b></code> ⊃</h4>
  </div>

  <ul>
    <li><code> 0 </code> — idle; no boot is running</li>
    <li><code>&gt; 0</code> — a boot session is active</li></li>
    <li><code>&lt; 0</code> — startup-only one-time stages before the primary boot begins</li>
  </ul>

  <p>In practice, treat any <code>CL.stage &gt; 0</code> as an active boot session.</p>

  <div align="left">
    <h4>⊂ <code><b>General Guard Pattern</b></code> ⊃</h4>
  </div>

  <p>To prevent errors and bugs in event logic that is intended to run during normal and stable gameplay, return early while boot is active:</p>

```js
tick = () => {
  if (CL.stage > 0) { return; }
  // your logic...
};

onBlockStand = (...) => {
  if (CL.stage !== 0) { return; }
  // your logic...
};

onClientOptionUpdated = (...) => {
  if (CL.stage) { return; }
  // your logic...
};
```

  <p>This is especially useful for naturally frequent events such as <code>tick</code>, <code>onBlockStand</code>, <code>onChunkLoaded</code>, <code>onInventoryUpdated</code>, and similar ones that are not meant to participate in boot.</p>

  <blockquote>
    <h4><code><b>! NOTE</b></code></h4>
    <p>Do not apply this generic early-return pattern to <code>onPlayerJoin</code> or <code>onPlayerLeave</code>. It may interfere with dedicated boot-time handling or suppress calls that may occur after the environment state has already become stable.</p>
  </blockquote>

  <hr>

  <div align="left">
    <h3>〔 <code><b>onPlayerJoin</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Join Safety Guard</b></code> ⊃</h4>
  </div>

  <p>Boot is not atomic, and queued joins may run later than the original game event call. By that time, the player may already have left, which can break normal join logic.</p>

```js
onPlayerJoin = (playerId, fromGameReset) => {
  if (!api.checkValid(playerId)) { return; }
  // your join logic...
};
```

  <p>Do not use the general boot guard here. The loader replays queued joins at stage <code>14</code>, and <code>CL.stage</code> early return can suppress your actual join logic there.</p>

  <div align="left">
    <h4>⊂ <code><b>CL.bootJoinStatus</b></code> ⊃</h4>
  </div>

  <p>When <code>onPlayerJoin</code> is active, the loader exposes this temporary map during boot. See <a href="#api-methods"><code><b>API Methods</b></code></a> for details.</p>

  <ul>
    <li>At stage <code>2</code>, the loader creates the queue and <code>CL.bootJoinStatus</code>, then installs the temporary queueing interceptor</li>
    <li>At stage <code>10</code>, already-online players are scanned and inserted into the queue with <code>fromGameReset = false</code></li>
    <li>Players covered by the effective mark-as-joined list are set to <code>2</code> and skipped during queued-join replay; others remain at <code>1</code> and are processed later</li>
    <li>If a player joins or rejoins before queued-join replay finishes, their status is set or reset to <code>1</code> and they can still be processed during stage <code>14</code></li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Queued Join Control</b></code> ⊃</h4>
  </div>

  <p><code>CL.onLoad</code> runs right before queued joins are replayed, so join status of specific players can be changed here for the current boot.</p>

```js
CL.onLoad = (context) => {
  // ...
  const playerIdsList = Object.keys(CL.bootJoinStatus);
  for (let i = 0, playerId = playerIdsList[i]; i < playerIdsList.length; playerId = playerIdsList[++i]) {
    if (shouldSkipThisBoot(playerId)) {
      CL.bootJoinStatus[playerId] = 2;
    }
  }
  // ...
  return true;
};
```

  <hr>
  <div align="left">
    <h3>〔 <code><b>onPlayerLeave</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Leave Safety Guard</b></code> ⊃</h4>
  </div>

  <p>Leave handling is intentionally different from join handling. The loader does not replay leave calls later. Instead, during boot it records leave metadata and immediately forwards the call to your current event handler.</p>

  <p>The main risk usually appears when a player was already online before the boot and some state related to that player has not yet been cleared. If that player leaves before the environment becomes stable, later boot-time changes, including handler resets, can lead to inconsistent game logic. The safest default is to ignore that boot-time leave window.</p>

```js
onPlayerLeave = (playerId, serverIsShuttingDown) => {
  if (CL.stage > 1 && CL.stage < 16) { return; }
  // your leave logic...
};
```

  <p>This range matches the unstable part of the boot, so normal leave handling stays disabled until the final event handler is restored.</p>

  <div align="left">
    <h4>⊂ <code><b><code>CL.bootLeaveRecords</code></b></code> ⊃</h4>
  </div>

  <p>When <code>onPlayerLeave</code> is active, the loader exposes this temporary record array during boot. See <a href="#api-methods"><code><b>API Methods</b></code></a> for details.</p>

  <ul>
    <li>At stage <code>3</code>, the loader creates <code>CL.bootLeaveRecords</code>, stores the current leave handler, and installs the temporary recording interceptor</li>
    <li>At stage <code>15</code>, that stored handler, or the newer one assigned by source execution, becomes the final active <code>onPlayerLeave</code></li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Leave State Finalization</b></code> ⊃</h4>
  </div>

  <p><code>CL.onEnd</code> runs after all queued joins are processed and the final leave handler has already been restored, so it is the right place to finalize player leave-related state.</p>

```js
CL.onEnd = (context) => {
  // ...
  const leaveRecords = CL.bootLeaveRecords;
  for (let i = 0; i < leaveRecords.length; ++i) {
    const [playerId, bootStage, joinStatus] = leaveRecords[i];
    // inspect or reconcile here
  }
  // ...
  return true;
};
```

  <blockquote>
    <h4><code><b>! NOTE</b></code></h4>
    <p>In partial reboot setups, it can be better to finalize player leave-related state inside <code>CL.onStart</code>, so leftover data from the previous environment does not interfere with the new boot.</p>
  </blockquote>

  <hr>

  <div align="left">
    <h3>〔 <code><b>Eval Guards</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Loader-only Execution</b></code> ⊃</h4>
  </div>

  <p>Use this guard for code that should run only when the loader evaluates the source, not when a player manually triggers the same block.</p>

```js
if (myId == null) {
  // runs only during loader-triggered evaluation
}
```

  <div align="left">
    <h4>⊂ <code><b>One-time Global Initialization</b></code> ⊃</h4>
  </div>

  <p>Use this guard for shared globals that should be created only once.</p>

```js
if (globalThis.propertyName == null) {
  globalThis.propertyName = (...);
  // ...
}
```

  <div align="left">
    <h4>⊂ <code><b>Combined Pattern</b></code> ⊃</h4>
  </div>

```js
if (myId == null) {
  if (globalThis.propertyName == null) {
    globalThis.propertyName = (...);
    // ...
  }
}
```

</details>

<hr>

<a id="api-methods"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📚 API Methods 📚</b></code> ❯</h2>
    </div>
  </summary>

  <p><code>globalThis.CL</code> / <code>CL</code> exposes:</p>

```js
/**
 * Live boot configuration object.
 *
 * Notes:
 * - Modify this property before `CL.reboot()` or inside `CL.onStart`.
 * - Some properties are startup-only and are not re-applied during later boot sessions.
 *
 * @type {object}
 */
config
```

```js
/**
 * Whether the current boot session is the primary one.
 *
 * Notes:
 * - `true` only during the first boot that starts after loader startup (`world code init`).
 * - `false` once that boot completes, and remains so for all later boot sessions.
 *
 * @type {boolean}
 */
isPrimaryBoot
```

```js
/**
 * Current loader stage.
 *
 * Notes:
 * - `0`   = idle / no boot is running.
 * - `> 0` = a boot session is active.
 * - `< 0` = startup-only one-time stages before the primary boot begins.
 * - See `References` for details.
 *
 * @type {number}
 */
stage
```

```js
/**
 * Progress cursor of the current or most recent boot session.
 *
 * Notes:
 * - Execution index of entries in `CL.config.sources`.
 *
 * @type {number}
 */
cursor
```

```js
/**
 * Unix timestamp in milliseconds, captured with `Date.now()` when the current
 * or most recent boot session started.
 *
 * @type {number}
 */
startTime
```

```js
/**
 * Unix timestamp in milliseconds, captured with `Date.now()` when the current
 * or most recent boot session ended.
 *
 * Notes:
 * - Remains `0` until the primary boot completes.
 *
 * @type {number}
 */
endTime
```

```js
/**
 * Callback called before the configuration for the current boot is captured.
 *
 * Typical uses:
 * - Prepare environment state and data before the main boot process begins.
 * - Modify `CL.config`.
 *
 * Notes:
 * - Receives a mutable temporary context object.
 * - Return `true` to move to the next boot stage (2 / 3 / 4).
 * - Return `false` to stay on the current boot stage (1); the callback will be called again next tick.
 * - Any other return value is coerced to `boolean` with normal truthy / falsy rules.
 * - If the callback throws, the error is recorded and the boot proceeds.
 * - The property is reset to the default pass-through callback at the end of the boot.
 *
 * @type {(context: object) => boolean}
 */
onStart
```

```js
/**
 * Callback called after source execution is complete and before queued joins are processed.
 *
 * Typical uses:
 * - Modify pre-join environment state and data.
 * - Execute additional sources manually.
 * - Mutate `CL.bootJoinStatus`.
 * - Inspect `CL.bootLeaveRecords`.
 *
 * Notes:
 * - Receives a mutable temporary context object.
 * - Return `true` to move to the next boot stage (14 / 15 / 16).
 * - Return `false` to stay on the current boot stage (13); the callback will be called again next tick.
 * - Any other return value is coerced to `boolean` with normal truthy / falsy rules.
 * - If the callback throws, the error is recorded and the boot proceeds.
 * - The property is reset to the default pass-through callback at the end of the boot.
 *
 * @type {(context: object) => boolean}
 */
onLoad
```

```js
/**
 * Callback called after join and leave handling is complete and before the end of the current boot.
 *
 * Typical uses:
 * - Finish game setup and finalize environment state.
 * - Inspect `CL.bootLeaveRecords` and `CL.bootJoinStatus`.
 * - Perform loader-side memory cleanup.
 *
 * Notes:
 * - Receives a mutable temporary context object.
 * - Return `true` to move to the next boot stage (17).
 * - Return `false` to stay on the current boot stage (16); the callback will be called again next tick.
 * - Any other return value is coerced to `boolean` with normal truthy / falsy rules.
 * - If the callback throws, the error is recorded and the boot proceeds.
 * - The property is reset to the default pass-through callback at the end of the boot.
 *
 * @type {(context: object) => boolean}
 */
onEnd
```

```js
/**
 * Boot-time join status map.
 *
 * Values:
 * - `1` = queued for processing
 * - `2` = already processed or intentionally marked as joined
 *
 * Notes:
 * - Exists only when `onPlayerJoin` event is active.
 * - Available only during boot; reset to `null` at the end.
 * - May be inspected or mutated inside loader callbacks.
 *
 * @type {Object<PlayerId, 1 | 2> | null}
 */
bootJoinStatus
```

```js
/**
 * Boot-time leave records.
 *
 * Entry format:
 * - `[playerId, bootStage, joinStatus]`
 *
 * Join status values:
 * - `0` = no boot join status existed for that player
 * - `1` = the player was queued but not processed by that time
 * - `2` = already processed or marked as joined
 *
 * Notes:
 * - Exists only when `onPlayerLeave` event is active.
 * - Available only during boot; reset to `null` at the end.
 * - May be inspected or mutated inside loader callbacks.
 *
 * @type {Array<[PlayerId, number, 0 | 1 | 2]> | null}
 */
bootLeaveRecords
```

```js
/**
 * Start a new boot session.
 *
 * Notes:
 * - Works only when `CL.stage === 0`.
 * - If a boot is already in progress, no boot state is changed and a warning is broadcast.
 *
 * @returns {void}
 */
reboot()
```

```js
/**
 * Broadcast boot duration and, optionally, the total error count.
 *
 * Notes:
 * - Uses live internal metadata during boot.
 * - Falls back to retained last-boot data after the boot completes.
 *
 * @param {boolean} [showErrorCount = true]
 * @returns {void}
 */
logBootStatus(showErrorCount)
```

```js
/**
 * Broadcast detailed errors of the current or most recent boot.
 *
 * Includes:
 * - `onStart` error
 * - `onLoad` error
 * - `onEnd` error
 * - code execution errors
 *
 * Notes:
 * - Uses live internal metadata during boot.
 * - Falls back to retained last-boot data after the boot completes.
 *
 * @param {boolean} [showSuccessMessage = true]
 * @returns {void}
 */
logErrorDetails(showSuccessMessage)
```

```js
/**
 * Broadcast execution details of the current or most recent boot.
 *
 * Notes:
 * - Lists executed source blocks with their coordinates and detected names.
 * - Uses live internal metadata during boot.
 * - Falls back to retained last-boot data after the boot completes.
 *
 * @returns {void}
 */
logExecutionDetails()
```

```js
/**
 * Broadcast a combined boot report.
 *
 * @param {boolean} [showBootStatus = true]
 * @param {boolean} [showErrorDetails = true]
 * @param {boolean} [showExecutionDetails = false]
 * @returns {void}
 */
logReport(showBootStatus, showErrorDetails, showExecutionDetails)
```

```js
/**
 * Styled broadcast logger used internally.
 *
 * Notes:
 * - Messages longer than `950` characters are split into safe segments.
 * - Splitting prefers newline boundaries; otherwise a fixed segment length is used.
 *
 * @param {string} message
 * @param {0 | 1 | 2 | 3 | 4} type
 * @returns {void}
 */
_log(message, type)
```

```js
/**
 * Reusable StyledText templates used by `CL._log`.
 *
 * Type index mapping:
 * - `0` = error
 * - `1` = warning
 * - `2` = success
 * - `3` = info
 * - `4` = bug / debug
 *
 * @type {Array<StyledText>}
 */
_log.payloads
```

```js
/**
 * Retained boot error data used by report helpers after boot completion.
 *
 * Format:
 * - `[onStartName, onStartMessage, onLoadName, onLoadMessage, onEndName, onEndMessage, executionErrorEntry, ...]`
 *
 * Execution error entry format:
 * - `[name, message, x, y, z]`
 *
 * @type {Array<string | [string, string, number, number, number, number?, number?] | null> | null}
 */
_bootErrors
```

```js
/**
 * Retained boot source data used by report helpers after boot completion.
 *
 * Format:
 * - `[[x, y, z, detectedBlockName?], ...]`
 *
 * Notes:
 * - Holds a direct reference to `CL.config.sources`; it is not a copy.
 *
 * @type {Array<[number, number, number, string?]> | null}
 */
_bootSources
```

</details>

<hr>

<a id="configuration"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🛠️ Configuration 🛠️</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Shape</b></code> 〕</h3>
  </div>

```js
let config = {
  events: [ ... ],
  sources: [ ... ],

  show_boot_status: true,
  show_error_details: true,
  show_execution_details: false,

  execution_budget_per_tick: 8,
  join_budget_per_tick: 8,

  players_to_mark_as_joined: [],
  handlers_to_preserve: null,
  globals_to_preserve: null,

  shutdown_on_startup_error: true,
};
```

  <div align="left">
    <h3>〔 <code><b>Reference Table</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th><code>Property</code></th>
        <th><code>Type</code></th>
        <th><code>Default</code></th>
        <th><code>When Used</code></th>
        <th><code>Description</code></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>events</code></td>
        <td><code>Array</code></td>
        <td><code>[]</code></td>
        <td>startup-only</td>
        <td>List of Bloxd callbacks used at startup to build loader-managed wrappers and internal event bindings.</td>
      </tr>
      <tr>
        <td><code>sources</code></td>
        <td><code>Array</code></td>
        <td><code>[]</code></td>
        <td>each boot</td>
        <td>List of source block positions to execute.</td>
      </tr>
      <tr>
        <td><code>show_boot_status</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>each boot</td>
        <td>Whether the end-of-boot report includes boot status and duration.</td>
      </tr>
      <tr>
        <td><code>show_error_details</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>each boot</td>
        <td>Whether the end-of-boot report includes boot lifecycle callback errors and source execution errors.</td>
      </tr>
      <tr>
        <td><code>show_execution_details</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>each boot</td>
        <td>Whether the end-of-boot report includes source execution details.</td>
      </tr>
      <tr>
        <td><code>execution_budget_per_tick</code></td>
        <td><code>number</code></td>
        <td><code>8</code></td>
        <td>each boot<br><br>when <code>sources.length &gt; 0</code></td>
        <td>Maximum number of source blocks executed per tick. Clamped to at least <code>1</code>.</td>
      </tr>
      <tr>
        <td><code>join_budget_per_tick</code></td>
        <td><code>number</code></td>
        <td><code>8</code></td>
        <td>each boot<br><br>when <code>onPlayerJoin</code> is active</td>
        <td>Maximum queued joins handled per tick once source execution is complete. Clamped to at least <code>1</code>.</td>
      </tr>
      <tr>
        <td><code>players_to_mark_as_joined</code></td>
        <td><code>Array&lt;PlayerId&gt; | null</code></td>
        <td><code>[]</code></td>
        <td>each boot<br><br>when <code>onPlayerJoin</code> is active</td>
        <td>Controls which already-online players are treated as joined by preassigning them boot join status <code>2</code>.</td>
      </tr>
      <tr>
        <td><code>handlers_to_preserve</code></td>
        <td><code>Array&lt;string&gt; | null</code></td>
        <td><code>null</code></td>
        <td>each boot</td>
        <td>Controls which loader-managed event handlers are not reset before source execution.</td>
      </tr>
      <tr>
        <td><code>globals_to_preserve</code></td>
        <td><code>Array&lt;string&gt; | null</code></td>
        <td><code>null</code></td>
        <td>each boot</td>
        <td>Controls which user-created globals are not deleted before source execution.</td>
      </tr>
      <tr>
        <td><code>shutdown_on_startup_error</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>startup-only</td>
        <td>Whether players are kicked on loader startup failure. If disabled, the error is still broadcast, but no shutdown tick is installed and loader setup remains incomplete.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>events</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Supported Entry Forms</b></code> ⊃</h4>
  </div>

```js
"eventName",
```
```js
["eventName", captureInterrupts?, eventValueFallback?],
```

  <ul>
    <li><code>eventName</code> — name of the Bloxd callback to manage</li>
    <li><code>captureInterrupts</code> — whether the event handler should be wrapped with the built-in <code>Interruption Framework</code>; the value is coerced to <code>boolean</code></li>
    <li><code>eventValueFallback</code> — value passed to <code>api.setCallbackValueFallback(...)</code> during primary bootstrap; if omitted or <code>undefined</code>, no fallback is applied</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Behavior Details</b></code> ⊃</h4>
  </div>

  <ul>
    <li>Invalid entries and duplicate event names throw a startup error</li>
    <li><code>tick</code> is handled separately and always installed, so listing it in <code>events</code> is optional and mainly for readability</li>
    <li>Later changes to <code>CL.config.events</code> do not rebuild wrappers or bindings, because those are established only once at loader startup and finalized during primary bootstrap</li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>sources</b></code> 〕</h3>
  </div>

```js
sources: [
  [blockX, blockY, blockZ],
  // ...
],
```

  <ul>
    <li>Each entry should be <code>[x, y, z]</code></li>
    <li>Any entry with length at least <code>3</code> is normalized in place: coordinates are floored and bitwise-coerced to 32-bit integers</li>
    <li>For each valid entry, the detected block name is written to index <code>3</code> of the same array for execution-detail reporting</li>
  </ul>

  <blockquote>
    <h4><code><b>! NOTE</b></code></h4>
    <p><code>sources</code> is read on each boot, so it can be changed dynamically before <code>CL.reboot()</code> or inside <code>CL.onStart</code>. This allows staged source sets and phased boot flows.</p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>players_to_mark_as_joined</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Possible Values</b></code> ⊃</h4>
  </div>

  <ul>
    <li><code>null</code> — mark <ins>all</ins> already-online players as joined for this boot; the effective list is captured at stage <code>2</code></li>
    <li><code>[]</code> — mark <ins>none</ins> of them</li>
    <li><code>[playerId, ...]</code> — mark <ins>only listed</ins> players</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Behavior Details</b></code> ⊃</h4>
  </div>

  <ul>
    <li>It does not suppress real <code>onPlayerJoin</code> calls that happen later during the same boot</li>
    <li>If the value is <code>null</code>, the loader uses <code>api.getPlayerIds()</code> <ins>at the start of the boot main process</ins> (stage <code>2</code>) to capture the effective list</li>
    <li>At stage <code>10</code>, every online player is inserted into the join queue with <code>fromGameReset = false</code></li>
    <li>Players covered by the effective mark-as-joined list are set to <code>2</code> and skipped during queued-join replay; others remain at <code>1</code> and are processed later</li>
    <li>If a player joins or rejoins before queued-join replay finishes, their status is set or reset to <code>1</code> and they can still be processed during stage <code>14</code></li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>handlers_to_preserve</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Possible Values</b></code> ⊃</h4>
  </div>

  <ul>
    <li><code>null</code> — preserve <ins>all</ins> current managed handlers</li>
    <li><code>[]</code> — preserve <ins>none</ins>; reset all of them</li>
    <li><code>[eventName, ...]</code> — preserve <ins>only listed</ins> handlers; reset the rest</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Behavior Details</b></code> ⊃</h4>
  </div>

  <ul>
    <li>The loader checks names only against its managed event set; unknown names are harmless and have no effect</li>
    <li><code>tick</code> is always part of that managed set, even if it is not listed in <code>events</code></li>
    <li>Non-preserved handlers are reset to the empty function before source execution</li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>globals_to_preserve</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Possible Values</b></code> ⊃</h4>
  </div>

  <ul>
    <li><code>null</code> — preserve <ins>all</ins> current user-created globals</li>
    <li><code>[]</code> — preserve <ins>none</ins>; delete all of them</li>
    <li><code>[propertyName, ...]</code> — preserve <ins>only listed</ins> globals; delete the rest</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Behavior Details</b></code> ⊃</h4>
  </div>

  <ul>
    <li>Globals that already existed at loader startup are preserved automatically, including loader-managed events and loader-installed <code>CL</code> and <code>IF</code></li>
    <li>Properties on <code>globalThis</code> are deleted after managed handlers are reset and before source execution begins</li>
  </ul>

</details>

<hr>

<a id="features"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>✨ Features ✨</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Externalized World Code</b></code> 〕</h3>
  </div>

  <p>The loader can keep real game logic outside the actual <code>World Code</code> field, making it smaller and easier to manage while allowing larger projects to be structured across separate source blocks.</p>

  <p>Bloxd provides <code>Hide Code</code> feature in the <code>Lobby Moderation</code> section of the shop menu or in the settings of your published <code>Custom Game</code>, allowing both <code>World Code</code> and <code>Code Block</code> data to be strongly hidden from players without coder permissions.</p>

  <hr>

  <div align="left">
    <h3>〔 <code><b>Dynamic Initialization</b></code> 〕</h3>
  </div>

  <p>The loader supports both targeted local refreshes and full environment rebuilds.</p>

  <ul>
    <li><code><b>partial</b></code> — manual source re-execution; any source block, even outside the current loader source set, can still be triggered directly by player click, which is useful for development, testing, and quick local fixes</li>
    <li><code><b>complete</b></code> — full boot session; <code>CL.reboot()</code> starts the loader boot flow using the live configuration</li>
  </ul>

  <p>Any source re-execution that assigns event handlers can hot-swap the logic of loader-managed Bloxd callbacks: the installed global wrapper stays the same, while the internal active handler reference changes.</p>

  <hr>

  <div align="left">
    <h3>〔 <code><b>Boot Lifecycle Callbacks</b></code> 〕</h3>
  </div>

  <p><code>CL.onStart</code>, <code>CL.onLoad</code>, and <code>CL.onEnd</code> are built into the loader and run during the boot process. They provide convenient dedicated control points for boot-specific logic and decisions that should not be mixed into ordinary event handlers.</p>

  <ul>
    <li>use <code>CL.onStart</code> for almost-immediate initialization close to <code>world code init</code>, early preprocessing, or safe configuration changes for the current boot</li>
    <li>use <code>CL.onLoad</code> to adjust environment state, or execute additional sources manually before queued joins are replayed</li>
    <li>use <code>CL.onEnd</code> to finish game setup, finalize environment state, or clear loader-side memory</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Interruption Safety</b></code> ⊃</h4>
  </div>

  <p>These lifecycle callbacks are <ins>not</ins> the place to use <code>Interruption Framework</code>, because they are not loader-managed events and follow a different execution model. Instead, each one receives a mutable temporary <code>context</code> object that persists across repeated calls on the same boot stage.</p>

  <p>Multi-tick pattern:</p>

  <ul>
    <li>store your phase and cache in <code>context</code></li>
    <li>return <code>false</code> while the callback still has work to do; plain <code>return;</code> behaves the same way because <code>undefined</code> is falsy</li>
    <li>return <code>true</code> when the work is finished and boot should continue</li>
  </ul>

```js
CL.onEnd = (context) => {
  context.phase ??= 1;

  // loader-side memory cleanup
  if (context.phase === 1) {
    const config = CL.config;

    if (CL.isPrimaryBoot) {
      delete config.events;
      delete config.shutdown_on_startup_error;
    }

    config.sources = null;
    CL._bootSources = null;

    // optionally
    config.players_to_mark_as_joined = null;
    config.handlers_to_preserve = null;
    config.globals_to_preserve = null;

    context.phase = 2;
  }

  if (context.phase === 2) {
    // ...
    return;
  }

  // ...

  return true;
};
```

```js
const createProcess = function* (context) {
  // phase 1
  {
    const config = CL.config;
  
    if (CL.isPrimaryBoot) {
      delete config.events;
      delete config.shutdown_on_startup_error;
    }
  
    config.sources = null;
    CL._bootSources = null;
  
    config.players_to_mark_as_joined = null;
    config.handlers_to_preserve = null;
    config.globals_to_preserve = null;
  }

  // phase 2
  {
    // ...
    yield;
  }

  // ...

  return true;
};

const _eval = eval;

CL.onEnd = (context) => {
  _eval();
  const process = context.process ??= createProcess(context);
  const result = process.next();
  return !!result.value || result.done;
};
```

  <hr>

  <div align="left">
    <h3>〔 <code><b>Boot Profiles</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Clean Boot</b></code> ⊃</h4>
  </div>

  <p>Use this when the environment should be rebuilt from scratch, with sources reconstructing everything and the new session should not carry over previous handlers or globals.</p>

```js
CL.config.players_to_mark_as_joined = [];
CL.config.handlers_to_preserve = [];
CL.config.globals_to_preserve = [];
```

  <div align="left">
    <h4>⊂ <code><b>Persistent Boot</b></code> ⊃</h4>
  </div>

  <p>Use this when the boot should mainly execute additional code or run extra setup on top of an already-established environment, without clearing its current state.</p>

```js
CL.config.players_to_mark_as_joined = null;
CL.config.handlers_to_preserve = null;
CL.config.globals_to_preserve = null;
```

  <div align="left">
    <h4>⊂ <code><b>Hybrid Boot</b></code> ⊃</h4>
  </div>

  <p>Use this when the boot should keep only certain parts of the current environment (such as admin tools, loading flow, or specific gameplay data), while the rest is rebuilt or updated.</p>

```js
CL.config.players_to_mark_as_joined = null;
CL.config.handlers_to_preserve = ["onPlayerJoin", "onPlayerLeave", "tick", "playerCommand"];
CL.config.globals_to_preserve = ["propertyName1", "propertyName2", "propertyName3"];
```

  <hr>

  <div align="left">
    <h3>〔 <code><b>Phased & Modular Boot Pattern</b></code> 〕</h3>
  </div>

  <p>The loader captures <code>CL.config</code> separately for each boot session, so every reboot can switch to a different source set, preservation policy, or source mode.</p>

  <p>Examples here are useful for phased initialization, module execution, supervisor-style systems, and larger codebases that are loaded on demand from a small bootstrap.</p>
  
```js
if (myId === null) {
  tick = () => {
    // ...
    if (CL.stage === 0) {
      CL.onStart = (context) => {
        const config = CL.config;
        config.sources = [...];
        // ...
        return true;
      };
      CL.reboot();
    }
    // ...
  };
}
```

```js
playerCommand = (playerId, command) => {
  // ...
  if ($condition) {
    const moduleName = getModuleName($data);

    if (CL.stage > 0) {
      CL._log(`Module "${moduleName}" cannot be loaded. Wait for the current boot to finish.`, 1);
      return true;
    }

    let isValidModule = false;
    const config = CL.config;

    if (moduleName === "test") {
      CL.onStart = (context) => {
        config.sources = [...];
        // ...
        return true;
      };

      isValidModule = true;
    }

    if (isValidModule) {
      CL._log(`Unknown module "${moduleName}".`, 0);
      return true;
    }

    CL.reboot();
    CL._log(`Loading "${moduleName}" module...`, 2);
    return true;
  }
  // ...
};
```

  <hr>

  <div align="left">
    <h3>〔 <code><b>Interruption Framework</b></code> 〕</h3>
  </div>

  <p><a href="https://github.com/justjake/quickjs-emscripten"><code>QuickJS-emscripten</code></a> engine tracks execution cost and may interrupt an event call (Bloxd callback) once the lobby runtime limit is exceeded.</p>

```js
if (operation_count % 5000 === 0 && runtime_count > RUNTIME_LOBBY_LIMIT) {
  interrupt();
}
```

  <p>Without extra handling, execution stops mid-flow and may leave partial work, inconsistent state, or lost event processing.</p>

  <p>The loader includes a built-in copy of <a href="https://github.com/delfineonx/interruption-framework"><code>Interruption Framework</code></a> and can connect it directly to event (Bloxd callback) internal wrappers on startup. When enabled, the wrapper tracks the active handler call and queues it for a later retry through <code>IF.tick()</code> if it throws any uncaught error, including <code>InternalError: Interrupted</code>.</p>

  <div align="left">
    <h4>⊂ <code><b>Integration & Setup</b></code> ⊃</h4>
  </div>

  <p>Enable interruption capture per event in <code>CL.config.events</code>.</p>

```js
events: [
  ["onPlayerChat", 1, null],
  ["playerCommand", 1],
]
```

  <p>If queued calls are never drained through <code>IF.tick()</code>, they accumulate and may eventually cause <code>InternalError: out of memory</code>. Run the framework inside <code>tick</code>, preferably before other logic.</p>

```js
tick = () => {
  if (CL.stage) { return; }
  IF.tick();
  // your tick logic...
};
```

  <div align="left">
    <h4>⊂ <code><b>Retry Model</b></code> ⊃</h4>
  </div>

  <p>By default, the framework retries the entire handler with its stored arguments. If execution is interrupted mid-way, a later retry may repeat work that should happen only once.</p>

  <ul>
    <li>For simple, naturally idempotent, or runtime-light handlers, whole-handler retry is often enough</li>
    <li>For more complex, stateful, or runtime-heavy handlers, use the framework API to build resumable multi-step logic</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Resumable Logic</b></code> ⊃</h4>
  </div>

  <ul>
    <li><code>IF.rcnt</code> — retry count for the current call</li>
    <li><code>IF.sid</code> — user-controlled state id for resumable logic</li>
    <li><code>IF.args</code> — current arguments array; it persists across retries, so you may mutate, replace, or extend it with extra context objects</li>
  </ul>

```js
onPlayerChat = (playerId, chatMessage, channelName) => {
  if (IF.sid === 0) {
    // attach context object for retry-persistent data
    IF.args[3] = {};
    IF.sid = 1;
  }

  const context = IF.args[3];

  if (IF.sid === 1) {
    // part A
    IF.sid = 2;
  }

  if (IF.sid === 2) {
    // part B
  }
};
```

  <div align="left">
    <h4>⊂ <code><b>Recommendations</b></code> ⊃</h4>
  </div>

  <ul>
    <li>Enable interruption capture only for events that really need it</li>
    <li>Do <ins>not</ins> use the framework inside boot lifecycle callbacks, because their execution model is different</li>
    <li>For large predictable workloads, prefer intentional multi-tick <ins>scheduling</ins> (using Bloxd <code>setTimeout</code> implementations) over repeated interruption-driven retries</li>
  </ul>

</details>

<hr>

<a id="example"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🧪 Example 🧪</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Setup</b></code> 〕</h3>
  </div>

  <ol>
    <li>Download and import the schematic <a href="./assets/delfineonx_example.bloxdschem"><code><b>delfineonx_example.bloxdschem</b></code></a>.</li>
    <li>Paste it with <code>World Builder</code> at position <code>(0, 0, 0)</code>.</li>
    <li>Put the configuration below into the real <code>World Code</code>.</li>
  </ol>

```js
let config = {
  events: [
    "tick",
    "onPlayerJoin",
    "onPlayerLeave",
    "playerCommand",
    "onPlayerChat",
    "onPlayerJump",
    "onPlayerClick",
    /*
    "tick",
    "onPlayerJoin",
    "onPlayerLeave",
    ["playerCommand", 0],
    ["onPlayerChat", 0, null],
    ["onPlayerJump", 0],
    "onPlayerClick",
    */
  ],

  sources: [
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

  show_boot_status: true,
  show_error_details: true,
  show_execution_details: false,

  execution_budget_per_tick: 8,
  join_budget_per_tick: 8,

  players_to_mark_as_joined: [],
  handlers_to_preserve: null,
  globals_to_preserve: null,

  shutdown_on_startup_error: true,
};
```

  <div align="left">
    <h3>〔 <code><b>Showcase</b></code> 〕</h3>
  </div>

  <ul>
    <li><a href="https://youtu.be/enxQP-3crGM"><code><b>Overview on YouTube</b></code></a> — <ins>outdated</ins></li>
  </ul>

</details>

<hr>

<a id="references"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📎 References 📎</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Boot Stages</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Primary Bootstrap</b></code> ⊃</h4>
  </div>

  <table>
    <thead>
      <tr>
        <th>Stage</th>
        <th>Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>-3</code></td><td>install managed event accessors on <code>globalThis</code> and apply callback fallback values through <code>api.setCallbackValueFallback(...)</code> when configured</td></tr>
      <tr><td><code>-2</code></td><td>build the initial global-property set that later must never be deleted during boot sessions</td></tr>
      <tr><td><code>-1</code></td><td>finish one-time primary bootstrap and proceed to the normal boot process</td></tr>
    </tbody>
  </table>

  <div align="left">
    <h4>⊂ <code><b>Normal Boot Session</b></code> ⊃</h4>
  </div>

  <table>
    <thead>
      <tr>
        <th>Stage</th>
        <th>Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>0</code></td><td>idle / stable environment; no boot is active</td></tr>
      <tr><td><code>1</code></td><td>run <code>CL.onStart(context)</code>, capture the live boot configuration, and expose <code>CL._bootErrors</code> for report helpers</td></tr>
      <tr><td><code>2</code></td><td>initialize boot-time join metadata and install the temporary <code>onPlayerJoin</code> interceptor</td></tr>
      <tr><td><code>3</code></td><td>initialize boot-time leave metadata and install the temporary <code>onPlayerLeave</code> interceptor</td></tr>
      <tr><td><code>4</code></td><td>read <code>handlers_to_preserve</code>; if needed, build the preserved-handler set</td></tr>
      <tr><td><code>5</code></td><td>reset non-preserved managed handlers to the empty function</td></tr>
      <tr><td><code>6</code></td><td>read <code>globals_to_preserve</code>; if needed, build the preserved-global set and snapshot current globals</td></tr>
      <tr><td><code>7</code></td><td>delete non-preserved globals from <code>globalThis</code></td></tr>
      <tr><td><code>8</code></td><td>release preservation setup metadata for handlers and globals</td></tr>
      <tr><td><code>9</code></td><td>build the pre-marked player set from <code>players_to_mark_as_joined</code></td></tr>
      <tr><td><code>10</code></td><td>scan online players, queue their boot joins, and mark selected players as already joined</td></tr>
      <tr><td><code>11</code></td><td>initialize source execution state and expose <code>CL._bootSources</code> for report helpers</td></tr>
      <tr><td><code>12</code></td><td>execute configured sources</td></tr>
      <tr><td><code>13</code></td><td>run <code>CL.onLoad(context)</code></td></tr>
      <tr><td><code>14</code></td><td>process queued joins and restore the final <code>onPlayerJoin</code> handler</td></tr>
      <tr><td><code>15</code></td><td>restore the final <code>onPlayerLeave</code> handler</td></tr>
      <tr><td><code>16</code></td><td>run <code>CL.onEnd(context)</code></td></tr>
      <tr><td><code>17</code></td><td>finalize the boot, report results, clear temporary boot metadata, restore the final tick handler, and return the loader to idle stage <code>0</code></td></tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>Full Event Config List</b></code> 〕</h3>
  </div>

```js
"tick",
"onClose",
"onPlayerJoin",
"onPlayerLeave",
"onPlayerJump",
"onRespawnRequest",
"playerCommand",
"onPlayerChat",
"onPlayerChangeBlock",
"onPlayerDropItem",
"onPlayerPickedUpItem",
"onPlayerSelectInventorySlot",
"onBlockStand",
"onPlayerAttemptCraft",
"onPlayerCraft",
"onPlayerAttemptOpenChest",
"onPlayerOpenedChest",
"onPlayerMoveItemOutOfInventory",
"onPlayerMoveInvenItem",
"onPlayerMoveItemIntoIdxs",
"onPlayerSwapInvenSlots",
"onPlayerMoveInvenItemWithAmt",
"onPlayerAttemptAltAction",
"onPlayerAltAction",
"onPlayerClick",
"onPlayerClickUp",
"onClientOptionUpdated",
"onMobSettingUpdated",
"onInventoryUpdated",
"onChestUpdated",
"onWorldChangeBlock",
"onCreateBloxdMeshEntity",
"onEntityCollision",
"onPlayerAttemptSpawnMob",
"onWorldAttemptSpawnMob",
"onPlayerSpawnMob",
"onWorldSpawnMob",
"onWorldAttemptDespawnMob",
"onMobDespawned",
"onPlayerAttack",
"onPlayerDamagingOtherPlayer",
"onPlayerDamagingMob",
"onMobDamagingPlayer",
"onMobDamagingOtherMob",
"onAttemptKillPlayer",
"onPlayerKilledOtherPlayer",
"onMobKilledPlayer",
"onPlayerKilledMob",
"onMobKilledOtherMob",
"onPlayerPotionEffect",
"onPlayerDamagingMeshEntity",
"onPlayerBreakMeshEntity",
"onPlayerUsedThrowable",
"onPlayerThrowableHitTerrain",
"onTouchscreenActionButton",
"onTaskClaimed",
"onChunkLoaded",
"onPlayerRequestChunk",
"onItemDropCreated",
"onPlayerStartChargingItem",
"onPlayerFinishChargingItem",
"onPlayerFinishQTE",
"onPlayerToggledShopMenu",
"onPlayerBoughtShopItem",
"doPeriodicSave",
```

```js
"tick",
["onClose", 0],
["onPlayerJoin", 0],
["onPlayerLeave", 0],
["onPlayerJump", 0],
["onRespawnRequest", 0, [0, -10000, 0]],
["playerCommand", 0, undefined],
["onPlayerChat", 0, null],
["onPlayerChangeBlock", 0, "preventChange"],
["onPlayerDropItem", 0, "preventDrop"],
["onPlayerPickedUpItem", 0],
["onPlayerSelectInventorySlot", 0],
["onBlockStand", 0],
["onPlayerAttemptCraft", 0, "preventCraft"],
["onPlayerCraft", 0],
["onPlayerAttemptOpenChest", 0, "preventOpen"],
["onPlayerOpenedChest", 0],
["onPlayerMoveItemOutOfInventory", 0, "preventChange"],
["onPlayerMoveInvenItem", 0, "preventChange"],
["onPlayerMoveItemIntoIdxs", 0, "preventChange"],
["onPlayerSwapInvenSlots", 0, "preventChange"],
["onPlayerMoveInvenItemWithAmt", 0, "preventChange"],
["onPlayerAttemptAltAction", 0, "preventAction"],
["onPlayerAltAction", 0],
["onPlayerClick", 0],
["onPlayerClickUp", 0],
["onClientOptionUpdated", 0],
["onMobSettingUpdated", 0],
["onInventoryUpdated", 0],
["onChestUpdated", 0],
["onWorldChangeBlock", 0, "preventChange"],
["onCreateBloxdMeshEntity", 0],
["onEntityCollision", 0],
["onPlayerAttemptSpawnMob", 0, "preventSpawn"],
["onWorldAttemptSpawnMob", 0, "preventSpawn"],
["onPlayerSpawnMob", 0],
["onWorldSpawnMob", 0],
["onWorldAttemptDespawnMob", 0, "preventDespawn"],
["onMobDespawned", 0],
["onPlayerAttack", 0],
["onPlayerDamagingOtherPlayer", 0, "preventDamage"],
["onPlayerDamagingMob", 0, "preventDamage"],
["onMobDamagingPlayer", 0, "preventDamage"],
["onMobDamagingOtherMob", 0, "preventDamage"],
["onAttemptKillPlayer", 0, "preventDeath"],
["onPlayerKilledOtherPlayer", 0, "keepInventory"],
["onMobKilledPlayer", 0, "keepInventory"],
["onPlayerKilledMob", 0, "preventDrop"],
["onMobKilledOtherMob", 0, "preventDrop"],
["onPlayerPotionEffect", 0],
["onPlayerDamagingMeshEntity", 0],
["onPlayerBreakMeshEntity", 0],
["onPlayerUsedThrowable", 0],
["onPlayerThrowableHitTerrain", 0],
["onTouchscreenActionButton", 0],
["onTaskClaimed", 0],
["onChunkLoaded", 0],
["onPlayerRequestChunk", 0],
["onItemDropCreated", 0],
["onPlayerStartChargingItem", 0],
["onPlayerFinishChargingItem", 0],
["onPlayerFinishQTE", 0],
["onPlayerToggledShopMenu", 0],
["onPlayerBoughtShopItem", 0],
["doPeriodicSave", 0],
```

</details>

<hr>

<a id="license"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>👥 License 👥</b></code> ❯</h2>
    </div>
  </summary>

```js
// Code Loader v2026-05-04-0001
// Interruption Framework v2026-04-22-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0
```

  <p><code>Code Loader</code> and the bundled <code>Interruption Framework</code> are distributed together in the same source file.</p>

</details>

<hr>
