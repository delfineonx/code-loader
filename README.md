
---

<div align="center">
  <h1>Code Loader</h1>
  <p>
    Automatically boot your world code, ensure target chunks are loaded,<br>
    and execute code stored as <code>block data</code> or <code>chest data</code>.<br>
    Built-in <code>StorageManager</code> provides an easy workflow for moving code into chest storage.<br>
    Built-in <a href="https://github.com/delfineonx/interruption-framework"><code>Interruption Framework</code></a> optionally provides interruption-safe event execution.
  </p>
  <p>
    <a href="#installation"><kbd>Installation</kbd></a> &nbsp;•&nbsp;
    <a href="#quick-start"><kbd>Quick Start</kbd></a> &nbsp;•&nbsp;
    <a href="#api-methods"><kbd>API Methods</kbd></a> &nbsp;•&nbsp;
    <a href="#configuration"><kbd>Configuration</kbd></a> &nbsp;•&nbsp;
    <a href="#storage-manager"><kbd>Storage Manager</kbd></a> &nbsp;•&nbsp;
    <a href="#storage-format"><kbd>Storage Format</kbd></a> &nbsp;•&nbsp;
    <a href="#features"><kbd>Features</kbd></a> &nbsp;•&nbsp;
    <a href="#example"><kbd>Example</kbd></a> &nbsp;•&nbsp;
    <a href="#troubleshooting"><kbd>Troubleshooting</kbd></a> &nbsp;•&nbsp;
    <a href="#license-and-credits"><kbd>License & Credits</kbd></a>
  </p>
</div>

---

<a id="installation"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📥 Installation 📥</b></code> ❯</h2>
    </div>
  </summary>

  <p>
    Copy the loader source code entirely into your real <code>World Code</code>.<br>
  </p>

  <h3>
    <a href="./src/code_loader_minified.js">
      <code><b>minified version</b></code>
    </a>
  </h3>

  <blockquote>
    <p>
      <code><b>! NOTE</b></code><br>
      The loader self-boots on world code init / lobby start.<br>
      You may define extra <ins>non-event</ins> functions and objects right after the loader code (below it).
    </p>
  </blockquote>

</details>

---

<a id="quick-start"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>⚡ Quick Start ⚡</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Setup</b></code> 〕</h3>
  </div>

  <p>Inside your real <code>World Code</code>:</p>
  <ul>
    <li>add event names to <code>EVENTS</code></li>
    <li>add code block positions to <code>BLOCKS</code></li>
  </ul>

```js
// ---------- EXAMPLE ----------
const configuration = {
  EVENTS: [
    // ...
    "tick",
    "playerCommand",
    "onPlayerChat",
    "onPlayerClick",
    // ...
  ],
  BLOCKS: [
    // ...
    [27, 4, 14],
    [27, 4, 12],
    [27, 4, 10],
    // ...
  ],
  // other fields remain unchanged
};
```

  <p>
    Distribute your world code among the specified blocks as needed (it has almost no difference in comparison to real <code>World Code</code>).<br>
    Remember that each block runs in its own scope (<a href="https://javascript.info/closure"><code>closure</code></a>).
  </p>

  <div align="left">
    <h3>〔 <code><b>Variables</b></code> 〕</h3>
  </div>

  <p>If your "global" variables were declared with <code>const</code> or <code>let</code> in real <code>World Code</code>, then switch to one of these:</p>
  <ul>
    <li><code>globalThis.variableName = ...</code> <sub>(explicit, recommended)</sub></li>
    <li><code>variableName = ...</code> <sub>(implicit)</sub></li>
    <li><code>var variableName = ...</code> <sub>(implicit)</sub></li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Event Handlers</b></code> 〕</h3>
  </div>

  <p>
    Prefer assigning callback functions to globals (properties on <code>globalThis</code>).<br>
    Avoid <ins>named function declarations</ins> for events, because when the loader wires handlers, such declarations may not work (behave unexpectedly).
  </p>

  <ul>
    <li><code>✔️ eventName = (...args) =&gt; { ... };</code></li>
    <li><code>✔️ eventName = function (...args) { ... };</code></li>
    <li><code>❌ function eventName(...args) { ... }</code> <sub>(not recommended)</sub></li>
  </ul>

```js
// ---------- EXAMPLE ----------
// ...
tick = () => { }; // (27, 4, 14)
onPlayerClick = (playerId, wasAltClick, x, y, z, blockName) => { }; // (27, 4, 12)
playerCommand = function (playerId) => { }; // (27, 4, 10)
onPlayerChat = function (playerId, chatMessage, channelName) { }; // (27, 4, 10)
// ...
```

  <div align="left">
    <h3>〔 <code><b>Boot Safety</b></code> 〕</h3>
  </div>

  <p>
    If the boot process takes long enough (because you lowered <code>execution_budget_per_tick</code> or you have many blocks to execute),
    some callbacks (especially <code>tick</code> and <code>onBlockStand</code>) may run while the loader is still booting. 
    At that point, not everything may be defined yet, which can lead to errors.
  </p>

  <p><code><ins>Solution</ins>:</code> guard the event function so it does nothing while the loader is still booting.</p>

```js
// ---------- RECOMMENDED PATTERN ----------
// works for ANY event function that may fire during boot (tick, onBlockStand, etc.)
// do NOT use it for onPlayerJoin

tick = () => {
  if (CL.isRunning) { return; }
  // your tick logic...
};

onBlockStand = (...) => {
  if (CL.isRunning) { return; }
  // your onBlockStand logic...
};
```

  <div align="left">
    <h3>〔 <code><b>Guard Pattern</b></code> 〕</h3>
  </div>

  <p>
    If you want to prevent manual execution when a player clicks the code block, wrap the content with <code>if (myId === null) { ... }</code>.<br>
    This makes such code executable only during loader boot process.
  </p>

</details>

---

<a id="api-methods"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>📚 API Methods 📚</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Code Loader</b></code> 〕</h3>
  </div>

  <p><code>globalThis.CL</code> / <code>CL</code> exposes:</p>

```js
/**
 * Accessor of `Storage Manager` object (frozen).
 */
SM
```
```js
/**
 * Accessor of `configuration` object (sealed).
 * You may mutate existing vaues by keys and then call `CL.reboot()`,
 * but you cannot add or delete properties.
 */
config
```
```js
/**
 * `true` only during the boot session that runs right after world init.
 * `false` after primary boot is finished.
 * 
 * @type {boolean}
 */
isPrimaryBoot
```
```js
/**
 * `true` while a boot session is currently running.
 * `false` after the boot is finished.
 * 
 * Notes:
 * - It can be useful to resolve conflicts,
 *   when actions in callbacks depend on not initialized states yet during boot.
 * 
 * @type {boolean}
 */
isRunning
```
```js
/**
 * Progress cursor of the current/last boot session.
 *
 * Notes:
 * - Updated while boot is running to indicate how far execution has advanced.
 * - Block mode: current index in `CL.config.BLOCKS`.
 * - Chest mode: number of processed storage partitions
 *   (i.e. index in the `blockList` passed to `CL.SM.build(...)`).
 * 
 * @type {number}
 */
cursor
```
```js
/**
 * Start a new boot session using the current (last) config.
 * 
 * Notes:
 * - Broadcasts warning if a boot session is already running.
 * 
 * @returns {void}
 */
reboot()
```
```js
/**
 * Broadcast load time and (optionally) errors count of the last boot.
 * 
 * @param {boolean} [showErrorCount = true]
 * @returns {void}
 */
logBootStatus(showErrorCount)
```
```js
/**
 * Broadcast collected execution (evaluation) errors from the last boot.
 * 
 * @param {boolean} [showSuccess = true]
 * @returns {void}
 */
logErrors(showSuccess)
```
```js
/**
 * Broadcast which blocks or storage were executed.
 * 
 * @returns {void}
 */
logExecutionInfo()
```
```js
/**
 * Broadcast summary of the last boot:
 * boot status + errors + execution info.
 * 
 * @param {boolean} [showBootStatus = true]
 * @param {boolean} [showErrors = true]
 * @param {boolean} [showExecutionInfo = false]
 * @returns {void}
 */
logReport(showBootStatus, showErrors, showExecutionInfo)
```

  <div align="left">
    <h3>〔 <code><b>Storage Manager</b></code> 〕</h3>
  </div>

  <p><code>globalThis.CL.SM</code> / <code>CL.SM</code> exposes:</p>

```js
/**
 * Create a registry unit (chest-like container) and store region bounds in slot 0.
 * 
 * Notes:
 * - Task is queued to tick internally.
 * 
 * @param {[number, number, number]} lowPosition - bottom left corner [x,y,z]
 * @param {[number, number, number]} highPosition - top right corner [x,y,z]
 * @returns {void}
 */
create(lowPosition, highPosition)
```
```js
/**
 * Broadcast info from an existing registry unit.
 * 
 * Notes:
 * - Task is queued to tick internally.
 * 
 * @param {[number, number, number]} registryPosition
 * @returns {void}
 */
check(registryPosition)
```
```js
/**
 * Convert code in blocks into chest storage inside the registered region.
 * 
 * Notes:
 * - Task is queued to tick internally.
 * 
 * @param {[number, number, number]} registryPosition
 * @param {Array<[number, number, number]>} blockList
 * @param {number} [maxStorageUnitsPerTick = 8]
 * @returns {void}
 */
build(registryPosition, blockList, maxStorageUnitsPerTick)
```
```js
/**
 * Remove all storage units and registry entries, but keep registry unit.
 * 
 * Notes:
 * - Task is queued to tick internally.
 * 
 * @param {[number, number, number]} registryPosition
 * @param {number} [maxStorageUnitsPerTick = 32]
 * @returns {void}
 */
dispose(registryPosition, maxStorageUnitsPerTick)
```

</details>

---

<a id="configuration"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🛠️ Configuration 🛠️</b></code> ❯</h2>
    </div>
  </summary>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>The main config object (<code>configuration</code>) is <ins>sealed</ins> on world code init.</li>
        <li><code>OM</code>, <code>BM</code>, <code>JM</code> are <ins>sealed</ins>.</li>
        <li><code>STYLES</code> is <ins>frozen</ins>.</li>
        <li>You can change some existing values by keys and then call <code>CL.reboot()</code>.</li>
        <li>You cannot add or remove properties (prevents accidental shape changes).</li>
      </ul>
    </p>
  </blockquote>

```js
const configuration = {
  EVENTS: [ ... ],
  BLOCKS: [ ... ],
  OM: { ... }, // boot manager
  BM: { ... }, // block manager
  JM: { ... }, // join manager
  STYLES: [ ... ],
};
```

  <blockquote>
    <p>
      <h4><code><b>! IMPORTANT</b></code></h4>
      Do not remove config properties (or their values in particular cases) from real <code>World Code</code> unless it is allowed in this documentation.
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>EVENTS</b></code> 〕</h3>
  </div>
  
  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>
          This array defines which in‑game callbacks the loader will wire up and manage.
        </li>
        <li>
          <code>eventName</code> must be a valid Bloxd callback name.
        </li>
        <li>
          <code>captureInterrupts</code> is converted to boolean (<code>!!value</code>).
          Use <code>1</code>/<code>0</code> (or <code>true</code>/<code>false</code>) for clarity.
        </li>
        <li>
          <code>fallbackValue</code> can be any value and is applied using <code>api.setCallbackValueFallback(eventName, fallbackValue)</code> once during primary boot. 
          When <code>fallbackValue</code> is <code>undefined</code> — it means "do not set a fallback" (skip) for an event.
        </li>
      </ul>
    </p>
  </blockquote>
  
  <div align="left">
    <h4>⊂ <code><b>Supported entries</b></code> ⊃</h4>
  </div>
  
  <ul>
    <li>
      <code>"eventName"</code>
      <ul>
        <li><code>captureInterrupts</code> defaults to <code>false</code></li>
        <li><code>fallbackValue</code> defaults to <code>undefined</code></li>
      </ul>
    </li>
    <li>
      <code>[eventName, captureInterrupts?, fallbackValue?]</code>
      <ul>
        <li><code>captureInterrupts</code> — boolean-ish value (default: <code>false</code>)</li>
        <li><code>fallbackValue</code> — any value (default: <code>undefined</code>)</li>
      </ul>
    </li>
  </ul>
  
  <blockquote>
    <p>
      <h4><code><b>! IMPORTANT</b></code></h4>
      <ul>
        <li>
          If you enable <code>captureInterrupts</code> for any events,
          you must call <code>IF.tick()</code> inside your <code>tick</code> callback
          (see <a href="#features">Interruption Handling</a>).
        </li>
        <li>
          Without <code>IF.tick()</code>, queued retry work will never be processed (and might later internally overflow memory).
        </li>
      </ul>
    </p>
  </blockquote>
  
  <blockquote>
    <p>
      <h4><code><b>! NOTE</b></code></h4>
      <ul>
        <li>
          <code>tick</code> is special and ignored by the event‑wrapper builder.
          You may still keep <code>"tick"</code> in the list for readability.
        </li>
        <li>
          Event wrappers are created based on the initial <code>EVENTS</code> list on world code init.
          Changing <code>EVENTS</code> later via <code>CL.config.EVENTS</code> will not change wrappers.
        </li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>BLOCKS</b></code> 〕</h3>
  </div>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>List of block positions that contain your stored code.</li>
        <li>Each entry is <code>[x, y, z]</code> (numbers are floored).</li>
        <li>Invalid entries are ignored.</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h4>⊂ <code><b>Storage type</b></code> ⊃</h4>
  </div>

  <ul>
    <li>
      <code><b>block data</b></code>
      <ul>
        <li><code>BM.is_chest_mode = false</code></li>
        <li>execution order = order of entries in <code>BLOCKS</code></li>
      </ul>
    </li>
    <li>
      <code><b>chest data</b></code>
      <ul>
        <li><code>BM.is_chest_mode = true</code></li>
        <li><code>BLOCKS</code> should contain only one entry: <code>[registryX, registryY, registryZ]</code></li>
        <li>execution order = storage order inside the registry (see <a href="#storage-format">Storage Format</a>)</li>
      </ul>
    </li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>OM (boot manager)</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>boot_delay_ms</code></td>
        <td align="right">Number</td>
        <td align="right"><code>100</code></td>
        <td>Delay (in milliseconds) before continuing with main processes of boot session. Min 0. Converted to ticks and floored.</td>
      </tr>
      <tr>
        <td><code>show_boot_status</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>true</code></td>
        <td>Whether to broadcast load time after boot.</td>
      </tr>
      <tr>
        <td><code>show_errors</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>true</code></td>
        <td>Whether to broadcast collected execution (evaluation) errors and thier count after boot.</td>
      </tr>
      <tr>
        <td><code>show_execution_info</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>false</code></td>
        <td>Whether to broadcast executed blocks (positions and names) or storage (position) info after boot.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>BM (block manager)</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>is_chest_mode</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>false</code></td>
        <td>Whether to read and execute from chest storage instead of block data.</td>
      </tr>
      <tr>
        <td><code>execution_budget_per_tick</code></td>
        <td align="right">Number</td>
        <td align="right"><code>8</code></td>
        <td>Max blocks (or storage partitions) executed per tick during boot. Min 1. Integer-floored.</td>
      </tr>
      <tr>
        <td><code>max_error_count</code></td>
        <td align="right">Number</td>
        <td align="right"><code>32</code></td>
        <td>Max errors to retain. Min 0. Integer-floored.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>JM (join manager)</b></code> 〕</h3>
  </div>

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th align="right">Type</th>
        <th align="right">Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>reset_on_reboot</code></td>
        <td align="right">Boolean</td>
        <td align="right"><code>true</code></td>
        <td>Whether to re-process join for all online players on reboot (even if already processed).</td>
      </tr>
      <tr>
        <td><code>dequeue_budget_per_tick</code></td>
        <td align="right">Number</td>
        <td align="right"><code>8</code></td>
        <td>Max queued players processed per tick during boot. Min 1. Integer-floored.</td>
      </tr>
    </tbody>
  </table>

  <div align="left">
    <h3>〔 <code><b>STYLES</b></code> 〕</h3>
  </div>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>Flat array of <code>StyledText</code> values used for loader logs.</li>
        <li>Format: <code>[color, fontWeight, fontSize, ...]</code> for 4 message types.</li>
      </ul>
    </p>
  </blockquote>

```js
STYLES: [
  "#FF775E", "500", "0.95rem", // error   (type 0)
  "#FFC23D", "500", "0.95rem", // warning (type 1)
  "#20DD69", "500", "0.95rem", // success (type 2)
  "#52B2FF", "500", "0.95rem", // info    (type 3)
]
```

</details>

---

<a id="storage-manager"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🛡️ Storage Manager 🛡️</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Purpose</b></code> 〕</h3>
  </div>

  <ul>
    <li>Moves your code from block data into chest item attributes (impossible to steal).</li>
    <li>Provides a deterministic storage so the loader can find and execute code later.</li>
    <li>Can spread work across ticks to avoid interruption issues.</li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Workflow</b></code> 〕</h3>
  </div>

```js
// 1) Create a registry unit (defines region where storage units can be placed)
CL.SM.create([lowX, lowY, lowZ], [highX, highY, highZ]);
```
```js
// 2) Remove previously built storage units (optional, recommended to prevent mixed data)
CL.SM.dispose([registryX, registryY, registryZ]);
```
```js
// 3) Build storage from your block positions list
CL.SM.build([registryX, registryY, registryZ], [
  // ...
  [27, 4, 14],
  [27, 4, 12],
  [27, 4, 10],
  // ...
]);
```
```js
// 4) Switch loader to chest mode

// either in real World Code (recommended)
const configuration = {
  // ...
  BLOCKS: [
    [registryX, registryY, registryZ]
  ],
  // ...
  BM: {
    is_chest_mode: true,
    // ...
  },
  // ...
};

// or at runtime
CL.config.BM.is_chest_mode = true;
CL.config.BLOCKS = [[registryX, registryY, registryZ]];
CL.reboot();
```

  <div align="left">
    <h3>〔 <code><b>Capacity</b></code> 〕</h3>
  </div>

  <p>
    One storage unit stores up to 4 block data (4 partitions).<br>
    Therefore, required storage units: <code>Math.floor((blockList.length + 3) / 4)</code>.
  </p>

  <p>
    Region capacity is the number of blocks inside the axis-aligned box: <code>(dx + 1) * (dy + 1) * (dz + 1) - 1</code>.<br>
    If capacity is smaller than required units, build will refuse.
  </p>

  <div align="left">
    <h3>〔 <code><b>Performance</b></code> 〕</h3>
  </div>

  <ul>
    <li>Use smaller <code>maxStorageUnitsPerTick</code> if you get many interruptions: <code>CL.SM.build(regPos, blockList, 4)</code></li>
    <li>Use larger values if you want faster conversion and your world runtime budget can handle it.</li>
    <li>Storage management tasks load relevant chunks automatically.</li>
  </ul>

  <blockquote>
    <p>
      <h4><code><b>! SAFETY NOTE</b></code></h4>
      <ul>
        <li><code>build(...)</code> places solid blocks (default: <code>"Bedrock"</code>) for each storage unit.</li>
        <li>Plan the region far away from gameplay, or in a sealed protected area.</li>
      </ul>
    </p>
  </blockquote>

</details>

---

<a id="storage-format"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🗂️ Storage Format 🗂️</b></code> ❯</h2>
    </div>
  </summary>

  <blockquote>
    <p>
      <h4><code><b>! INFO</b></code></h4>
      <ul>
        <li>This section documents how the built-in format works (useful for debugging or for custom tooling).</li>
        <li>Storage consists of a <ins>registry unit</ins> and many <ins>storage units</ins>.</li>
      </ul>
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>Registry Unit</b></code> 〕</h3>
  </div>

  <ul>
    <li>Position: <code>BLOCKS[0]</code> when <code>is_chest_mode = true</code></li>
    <li>Slot 0 must contain <code>item.attributes.customAttributes.region = [lowX,lowY,lowZ,highX,highY,highZ]</code></li>
    <li>Slots 1..35 store coordinate lists of storage units in <code>item.attributes.customAttributes._</code></li>
    <li>Each coordinate list is a flat array: <code>[x0,y0,z0, x1,y1,z1, ...]</code></li>
  </ul>

  <blockquote>
    <p>
      Each registry slot can store up to <code>243</code> numbers (= <code>81</code> positions).<br>
      If you have more storage units, the manager writes multiple slots.
    </p>
  </blockquote>

  <div align="left">
    <h3>〔 <code><b>Storage Unit</b></code> 〕</h3>
  </div>

  <ul>
    <li>Physically: a block placed at some <code>(x,y,z)</code> inside the registry region.</li>
    <li>Logically: a chest container at that position holding code (text) segments.</li>
    <li>Contains <ins>4 partitions</ins> (so one storage unit stores up to 4 code blocks data)</li>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Partitions & Slots</b></code> 〕</h3>
  </div>

  <p>
    Each partition uses <ins>9 slots</ins> (total 36 slots in a chest):
  </p>

  <ul>
    <li>Partition <code>0</code>: slots <code>0..8</code></li>
    <li>Partition <code>1</code>: slots <code>9..17</code></li>
    <li>Partition <code>2</code>: slots <code>18..26</code></li>
    <li>Partition <code>3</code>: slots <code>27..35</code></li>
  </ul>

  <p>
    Each slot stores a <ins>raw string</ins> data segment in <code>item.attributes.customAttributes._</code>.<br>
    To execute a partition, the loader concatenates up to 9 chunks and calls indirect <code>_eval</code>.
  </p>

</details>

---

<a id="features"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>✨ Features ✨</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Hide World Code</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Description</b></code> ⊃</h4>
  </div>

  <p>
    Moving your logic into block data (code blocks) prevents casual copying of your world code (normally accessible via <kbd>F8</kbd> or directly from the code editor; also in custom games). However, block data can still be easily read by attackers (exploiters) where the chunks are loaded.
  </p>

  <p>
    For maximum protection, move your code from blocks into chest storage using the <code>Storage Manager</code>. Chest data is effectively impossible to steal in practice.
  </p>

  <div align="left">
    <h4>⊂ <code><b>Recommendation</b></code> ⊃</h4>
  </div>

  <ul>
    <li>Place code blocks or storage far away from gameplay areas.</li>
    <li>Seal them inside a protected multi-layer structure (optionally bedrock).</li>
    <li>Optionally use the guard pattern to prevent manual execution by clicking blocks.</li>
  </ul>

```js
if (myId === null) {
  // runs only during loader boot (not on player click)
}
```

  <div align="left">
    <h3>〔 <code><b>Unlimited World Code</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Description</b></code> ⊃</h4>
  </div>

  <p>
    Real <code>World Code</code> is limited to <code>16000</code> characters.
    The loader bypasses this restriction by distributing your logic across any number of blocks or chest storage units.
  </p>

  <ul>
    <li>Execution order follows <code>BLOCKS</code> (or storage order in chest mode).</li>
    <li>In practice, <code>BLOCKS</code> array in configuration can have roughly up to <code>~8000</code> code block positions.</li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Capacity</b></code> ⊃</h4>
  </div>

  <p>
    <code>16000</code> chars — real <code>World Code</code> capacity.<br>
    <code>11160</code> chars — default loader minified source code.<br>
    <code>13330</code> chars — with maxed out configuration.
  </p>

  <p>
    With typical block coordinate entries:
  </p>

  <ul>
    <li><code>[-100000,-100000,-100000],</code> -> ~27 chars</li>
    <li><code>[10,10,10],</code> -> ~12 chars</li>
  </ul>

  <p>
    This leaves <code>~2670</code> characters available, which is enough for approximately <code>90–220+</code> block positions directly inside real <code>World Code</code>.
  </p>

  <div align="left">
    <h4>⊂ <code><b>Staged Boot Method</b></code> ⊃</h4>
  </div>

  <p>
    You can dynamically replace/change <code>CL.config.BLOCKS</code> at runtime and then call <code>CL.reboot()</code>. This allows staged loading of large codebases while keeping only a few block positions in real <code>World Code</code>.
  </p>

```js
if (myId === null) {
  const blockList = [
    // ...
    [27, 4, 14],
    [27, 4, 12],
    [27, 4, 10],
    // ...
  ];

  tick = () => {
    if(!CL.isRunning) {
      const om = CL.config.OM;
      
      om.boot_delay_ms = 0;
      om.show_boot_status = true;
      om.show_errors = true;
      CL.config.BLOCKS = blockList;
      
      CL.reboot();
    }
  };
}
```

  <div align="left">
    <h3>〔 <code><b>Dynamic Initialization</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Description</b></code> ⊃</h4>
  </div>

  <p>
    In process of development or testing, you may want to refresh only part of your logic instead of rebooting everything. The loader supports both types of re-initialization:
  </p>

  <ul>
    <li><code>Partial</code> — click a specific code block to re-execute only that block.</li>
    <li><code>Complete</code> — call <code>CL.reboot()</code> to run a full boot session.</li>
  </ul>

  <p>
    If executed code defines callback functions, handlers are replaced immediately, making hot-swapping logic possible.
  </p>

  <div align="left">
    <h3>〔 <code><b>Interruption Handling</b></code> 〕</h3>
  </div>

  <div align="left">
    <h4>⊂ <code><b>Description</b></code> ⊃</h4>
  </div>

  <p>
    Bloxd can interrupt JavaScript code execution mid‑flow (due to runtime budget). Internally this surfaces as an <code>InternalError</code>.
    Code Loader has built-in <a href="https://github.com/delfineonx/interruption-framework"><code>Interruption Framework</code></a>, which can capture such interruptions for selected callbacks, queue the call, and retry it later when you explicitly run the framework.
  </p>

  <ul>
    <li>
      Enable per event in <code>EVENTS</code> by setting <code>captureInterrupts = 1</code> for that callback.
    </li>
    <li>
      Retries are processed only when <code>IF.tick()</code> runs — usually at the top of your <code>tick</code> callback.
    </li>
  </ul>

  <div align="left">
    <h4>⊂ <code><b>Runner</b></code> ⊃</h4>
  </div>

  <p>
    Call the framework runner once per tick (preferably before any other logic).
  </p>

```js
tick = () => {
  if (CL.isRunning) { return; }
  IF.tick(); // required if captureInterrupts is enabled for any event
  // your tick logic...
};
```

  <div align="left">
    <h4>⊂ <code><b>Interruption Safety</b></code> ⊃</h4>
  </div>

  <p>
    Capturing interruptions only retries the whole callback. If your handler does "half the work" and then gets interrupted again, it can repeat work.
    For heavy callbacks, prefer a tiny state machine and advance it using:
    <code>IF.sid</code> (your resume state / phase) and optional <code>IF.args</code> (you may attach extra cached data to survive retries).
  </p>

  <ul>
    <li><code>IF.rcnt</code> — retry counter for the currently executing queued task.</li>
    <li><code>IF.sid</code> — state id you control (set it right before expensive steps).</li>
    <li><code>IF.args</code> — current args array; you may mutate it (or replace with a bigger array) to include a cache object.</li>
  </ul>

```js
// ---------- IDEMPOTENCY PATTERN (example) ----------
onPlayerClick = (playerId, wasAltClick, x, y, z, blockName) => {
  // step 0: prepare (runs once, unless you reset IF.sid yourself)
  if (IF.sid === 0) {
    const cache = {
      // put precomputed stuff here
      // (path, list of entities, parsed data, etc.)
    };

    // attach cache so it survives retries
    IF.args[6] = cache;
    IF.sid = 1;
  }

  const cache = IF.args[6];

  // step 1
  if (IF.sid === 1) {
    // ...part A...
    IF.sid = 2;
  }

  // step 2
  if (IF.sid === 2) {
    // ...part B...
    IF.sid = 0; // reset when fully done
  }
};
```

  <blockquote>
    <p>
      <h4><code><b>! NOTE</b></code></h4>
      If you don't need retry/resume for an event, keep <code>captureInterrupts</code> disabled. Usually for very heavy work it is still better to split it across ticks using a scheduler.
    </p>
  </blockquote>

</details>

---

<a id="example"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🧪 Example 🧪</b></code> ❯</h2>
    </div>
  </summary>

  <div align="left">
    <h3>〔 <code><b>Files</b></code> 〕</h3>
  </div>

  <ul>
    <li>
      <a href="./assets/delfineonx_example.bloxdschem">
        <code><b>example .bloxdschem</b></code>
      </a>
    </li>
    <li>
      <a href="./assets/delfineonx_config.js">
        <code><b>config .js</b></code>
      </a>
  </ul>

  <div align="left">
    <h3>〔 <code><b>Setup</b></code> 〕</h3>
  </div>

  <ol>
    <li>
      Download and load schematic <code>delfineonx_example.bloxdschem</code>.
    </li>
    <li>
      Paste it using <code>World Builder</code> at position <code>(0, 0, 0)</code>.
    </li>
    <li>
      Open <code>delfineonx_config.js</code>, copy the <code>configuration</code> object, and replace your current config in real <code>World Code</code>.
    </li>
  </ol>

  <div align="left">
    <h3>〔 <code><b>Showcase</b></code> 〕</h3>
  </div>

  <ul>
    <li>
      <a href="https://youtu.be/enxQP-3crGM">
        <code><b>Overview on YouTube</b></code>
      </a><br>
    </li>
  </ul>

</details>

---

<a id="troubleshooting"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>🧯 Troubleshooting 🧯</b></code> ❯</h2>
    </div>
  </summary>

  <ul>
    <li>
      <code>"Reboot request was denied."</code><br>
      You called <code>CL.reboot()</code> while a boot session is already running.
      Wait until <code>CL.isRunning</code> becomes <code>false</code>.
    </li>
    <li>
      <code>"Code Loader EM: Error on primary setup - ..."</code><br>
      A critical error happened during the initial setup phase (right on world code init).
      Most common causes:
      <ol>
        <li>Syntax error / accidental edits inside the loader source.</li>
        <li>Invalid <code>configuration</code> shape.</li>
      </ol>
      <p>
        <code><ins>Fix</ins>:</code> reinstall the loader code, then re-apply your configuration edits carefully.
      </p>
    </li>
    <li>
      <b>No code executes from blocks.</b><br>
      <ol>
        <li>Double-check your <code>BLOCKS</code> coordinates (you can use <code>CL.logExecutionInfo()</code>).</li>
        <li>Make sure those blocks contain code in their data.</li>
        <li>Remember: each executed block runs in its own scope, so "globals" must be on <code>globalThis</code>.</li>
      </ol>
    </li>
    <li>
      <b>Chest mode: nothing executes / "No storage data found".</b><br>
      <ol>
        <li>
          Ensure chest mode is actually enabled:
          <code>BM.is_chest_mode = true</code>
          and
          <code>BLOCKS = [[registryX, registryY, registryZ]]</code>.
        </li>
        <li>
          Verify the registry unit exists at specified position and has region metadata in slot 0. Quick check: run <code>CL.SM.check([registryX, registryY, registryZ])</code>.
        </li>
        <li>
          If registry is valid but storage is missing/corrupted, rebuild:
          <code>CL.SM.dispose(regPos)</code> then <code>CL.SM.build(regPos, blockList)</code>.
        </li>
      </ol>
    </li>
    <li>
      <b><code>Storage Manager</code> refuses to build.</b><br>
      Common messages:
      <ul>
        <li>
          <code>"Invalid registry position..."</code> / <code>"Invalid region positions..."</code><br>
          You passed something other than <code>[x, y, z]</code> arrays.
        </li>
        <li>
          <code>"Not enough space. Need ... storage units, but region holds ..."</code><br>
          Enlarge the region (or reduce <code>blockList</code> size). One storage unit stores up to 4 blocks.
        </li>
      </ul>
    </li>
    <li>
      <b>Interrupted events are never retried</b><br>
      <ol>
        <li>
          Make sure the event entry has <code>captureInterrupts = 1</code> in <code>EVENTS</code>.
        </li>
        <li>
          Ensure your <code>tick</code> calls <code>IF.tick()</code> (and that you don't return before it).
        </li>
      </ol>
    </li>
    <li>
      <b>Same <code>onPlayerJoin</code> logic runs again after <code>CL.reboot()</code></b><br>
      This is controlled by <code>JM.reset_on_reboot</code>. If you don't want join to re-run for already-online players, set:
      <code>JM.reset_on_reboot = false</code>.
    </li>
  </ul>

</details>

---

<a id="license-and-credits"></a>
<details open>
  <summary>
    <div align="center">
      <h2>❮ <code><b>👥 License & Credits 👥</b></code> ❯</h2>
    </div>
  </summary>

```js
// Code Loader v2026-03-06-0001
// Interruption Framework v2026-03-01-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0
```

</details>

---
