// Code Loader v2026-03-06-0001
// Interruption Framework v2026-03-01-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

const configuration = {
  // [eventName | [eventName, captureInterrupts?, fallbackValue?], ...]
  // [string | [string, boolean|number|null, any], ...]
  EVENTS: [
  /*
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
    ["onPlayerBoughtShopItem", 0],
    ["doPeriodicSave", 0],
  */
  ],

  // [[x, y, z, string], ...]
  // [[number, number, number, blockName?], ...]
  BLOCKS: [
    /* ... */
  ],

  OM: { // boot manager
    boot_delay_ms: 100,
    show_boot_status: true,
    show_errors: true,
    show_execution_info: false,
  },
  BM: { // block manager
    is_chest_mode: false,
    execution_budget_per_tick: 8,
    max_error_count: 32,
  },
  JM: { // join manager
    reset_on_reboot: true,
    dequeue_budget_per_tick: 8,
  },

  STYLES: [
    "#FF775E", "500", "0.95rem", // error
    "#FFC23D", "500", "0.95rem", // warning
    "#20DD69", "500", "0.95rem", // success
    "#52B2FF", "500", "0.95rem",  // info
  ],
};

{
  const _CF_ = configuration;
  const _IF_ = {
    en: 0, // enable interrupt capture
    fn: null, // handler
    args: null, // can include "cache"
    rcnt: 0, // retry counter
    sid: 0, // state id

    noArgs: null,

    tick: null,
  };
  const _SM_ = {
    create: null,
    check: null,
    build: null,
    dispose: null,
  };
  const _CL_ = {
    SM: null,
    config: null,
    isPrimaryBoot: true,
    isRunning: false,
    cursor: 0,

    reboot: null,
    logBootStatus: null,
    logErrors: null,
    logExecutionInfo: null,
    logReport: null,
  };

    /* ---------------- Shared ---------------- */
  const _eval = eval;
  const _floor = Math.floor;
  const _getBlockId = api.getBlockId;
  const _getBlockData = api.getBlockData;
  const _getStandardChestItems = api.getStandardChestItems;

  const _NO_OP = Object.freeze(function () { });
  const _LOG_STYLES = [];
  const _LOG_PREFIX = "Code Loader";

  const _log = (message, type) => {
    const styledText = _LOG_STYLES[type];
    styledText[0].str = message;
    api.broadcastMessage(styledText);
    styledText[0].str = "";
  };

  const _establish = () => {
    const JM_config = _CF_.JM;
    const BM_config = _CF_.BM;
    const OM_config = _CF_.OM;

    _EM_resetCursor = 0;

    _TM_boot = _NO_OP;
    _TM_main = _NO_OP;

    if (_EM_join_handler) {
      _JM_resetOnReboot = !!JM_config.reset_on_reboot;
      _JM_dequeueBudgetPerTick = JM_config.dequeue_budget_per_tick | 0;
      _JM_dequeueBudgetPerTick = (_JM_dequeueBudgetPerTick & ~(_JM_dequeueBudgetPerTick >> 31)) + (-_JM_dequeueBudgetPerTick >> 31) + 1; // maxDequeuePerTick > 0 ? maxDequeuePerTick : 1
      _JM_main = _NO_OP;
      if (!_OM_isPrimaryBoot) {
        _JM_queue.length = 0;
        if (_JM_resetOnReboot) { _JM_playerStatus = {}; }
      }
      _JM_queueCursor = 0;
    }

    _BM_blockList = (_CF_.BLOCKS instanceof Array) ? _CF_.BLOCKS : [];
    _BM_isChestMode = !!BM_config.is_chest_mode;
    _BM_executionBudgetPerTick = BM_config.execution_budget_per_tick | 0;
    _BM_executionBudgetPerTick = (_BM_executionBudgetPerTick & ~(_BM_executionBudgetPerTick >> 31)) + (-_BM_executionBudgetPerTick >> 31) + 1; // maxExecutionsPerTick > 0 ? maxExecutionsPerTick : 1
    _BM_errorLimit = BM_config.max_error_count | 0;
    _BM_errorLimit = _BM_errorLimit & ~(_BM_errorLimit >> 31); // maxErrorsCount > 0 ? maxErrorsCount : 0
    _BM_errorList.length = 1;
    _BM_errorList[0] = null;
    _BM_errorIndex = 0;
    _BM_blockCursor = 0;
    _BM_blockCount = _BM_blockList.length;
    if (_BM_isChestMode) {
      _BM_isRegistryLoaded = false;
      _BM_loadedChunks = {};
      _BM_registrySlotIndex = 1;
      _BM_coordIndex = 0;
      _BM_partition = 0;
    }

    _OM_bootDelayTicks = ((OM_config.boot_delay_ms | 0) * 0.02) | 0;
    _OM_bootDelayTicks = _OM_bootDelayTicks & ~(_OM_bootDelayTicks >> 31); // bootDelayTicks > 0 ? bootDelayTicks : 0
    _OM_showBootStatus = !!OM_config.show_boot_status;
    _OM_showErrors = !!OM_config.show_errors;
    _OM_showExecutionInfo = !!OM_config.show_execution_info;
    _OM_loadDurationTicks = -1;
  };

    /* ---------------- Interruption Framework ---------------- */
  {
    const _IF = _IF_;

    const _NO_OP = _IF.fn = Object.freeze(() => { });
    const _NO_ARGS = _IF.args = (_IF.noArgs = Object.freeze([]));
    const _NO_TASK = [null, _NO_ARGS, null, 0];

    const _queue = [];
    let _task = _NO_TASK;
    let _external = 1;

    let _headIndex = 0;
    let _tailIndex = 0;
    let _queueSize = 0;

    _IF.tick = () => {
      _IF.fn = _NO_OP;
      _IF.args = _NO_ARGS;
      if (!_queueSize) { return; }

      _external = 0;

      let _error = null;
      while (_queueSize) {
        _task = _queue[_headIndex];

        _IF.args = _task[1];
        _IF.rcnt = ++_task[2];
        _IF.sid = _task[3];
        try {
          _task[0](..._IF.args);
        } catch (error) {
          _error = error;
        }

        _queue[_headIndex] = undefined;
        _headIndex++;
        _queueSize--;

        if (_error) {
          _log(
            "Interruption Framework [" + (_task[0]?.name || "<anonymous>") + "]: " +
            _error.name + ": " + _error.message, 0
          );
          _error = null;
        }
      }
      _headIndex = 0;
      _tailIndex = 0;
      _queue.length = 0;
      
      _task = _NO_TASK;

      _IF.en = 0;
      _IF.fn = _NO_OP;
      _IF.args = _NO_ARGS;
      _IF.rcnt = 0;

      _external = 1;
    };
    
    Object.defineProperty(globalThis.InternalError.prototype, "name", {
      configurable: true,
      get: () => {
        if (_external) {
          if (_IF.en) {
            _IF.en = 0;
            _queue[_tailIndex] = [_IF.fn, _IF.args, 0, _IF.sid];
            _tailIndex++;
            _queueSize++;
          }
        } else {
          _IF.en = 0;
          _IF.rcnt = 0;
          _task[1] = _IF.args;
          _task[3] = _IF.sid;
          _task = _NO_TASK;
          _IF.args = _NO_ARGS;
          _external = 1;
        }
        return "InternalError";
      },
    });
  }

  /* ---------------- Storage Manager ---------------- */
  let _SM_queue;
  let _SM_tick;
  {
    const _setBlock = api.setBlock;
    const _getStandardChestItemSlot = api.getStandardChestItemSlot;
    const _setStandardChestItemSlot = api.setStandardChestItemSlot;

    const _prefix = _LOG_PREFIX + " SM: ";
    const _queue = _SM_queue = [];
    let _queueCursor = 0;
    let _taskState = 1;
    const _blockType = "Bedrock";
    const _itemType = "Boat";
    const _storageSlotData = { customAttributes: { _: null } };
    const _registrySlotData = { customAttributes: { _: [] } };
    const _coordWriteBuffer = _registrySlotData.customAttributes._;
    const _textSegmentsBuffer = [];
    let _loadedChunks; // "cx|cy|cz" -> true
    let _registryChestPos; // [rx, ry, rz]
    let _storageChestPos; // [sx, sy, sz]
    let _registryItems;
    let _registrySlotIndex;
    let _lowX;
    let _lowY;
    let _lowZ;
    let _highX;
    let _highY;
    let _highZ;
    let _storageX;
    let _storageY;
    let _storageZ;
    let _blockCursor;
    let _partition;
    let _coordReadList; // [sx, sy, sz, ...]
    let _coordIndex;
    let _coordValueCount;

    const _readRegistryInfo = (registryPos) => {
      if (!registryPos?.length || registryPos.length < 3) {
        _log(_prefix + "Invalid registry position. Expected registryPos as [x, y, z].", 1);
        return null;
      }

      const rx = _floor(registryPos[0]) | 0;
      const ry = _floor(registryPos[1]) | 0;
      const rz = _floor(registryPos[2]) | 0;

      if (_getBlockId(rx, ry, rz) === 1) { return false; }

      const registryChestPos = [rx, ry, rz];
      const region = _getStandardChestItemSlot(registryChestPos, 0)?.attributes?.customAttributes?.region;

      if (!region) {
        _log(_prefix + "No valid registry unit found at (" + rx + ", " + ry + ", " + rz + ").", 1);
        return null;
      }

      return [registryChestPos, region];
    };

    const _create_task = (lowPos, highPos) => {
      if (!lowPos?.length || !highPos?.length || lowPos.length < 3 || highPos.length < 3) {
        _log(_prefix + "Invalid region positions. Expected lowPos and highPos as [x, y, z].", 1);
        return true;
      }

      const lowX = _floor(lowPos[0]) | 0;
      const lowY = _floor(lowPos[1]) | 0;
      const lowZ = _floor(lowPos[2]) | 0;
      const highX = _floor(highPos[0]) | 0;
      const highY = _floor(highPos[1]) | 0;
      const highZ = _floor(highPos[2]) | 0;

      if (lowX > highX || lowY > highY || lowZ > highZ) {
        _log(_prefix + "Invalid region bounds. lowPos [" + lowX + ", " + lowY + ", " + lowZ + "] must be <= highPos [" + highX + ", " + highY + ", " + highZ + "] on all axes.", 1);
        return true;
      }

      if (_getBlockId(lowX, lowY, lowZ) === 1) { return false; }

      _setBlock(lowX, lowY, lowZ, _blockType);
      _setStandardChestItemSlot([lowX, lowY, lowZ], 0, _itemType, null, undefined, {
        customAttributes: {
          region: [lowX, lowY, lowZ, highX, highY, highZ]
        }
      });

      _log(_prefix + "Registry unit created at (" + lowX + ", " + lowY + ", " + lowZ + ").", 2);
      return true;
    };

    const _check_task = (registryPos) => {
      const registryInfo = _readRegistryInfo(registryPos);
      if (registryInfo === false) { return false; }
      if (registryInfo === null) { return true; }

      const region = registryInfo[1];
      _log(_prefix + "Storage covers region from (" + region[0] + "," + region[1] + "," + region[2] + ") to (" + region[3] + "," + region[4] + "," + region[5] + ").", 3);
      return true;
    };

    const _build_task = (registryPos, blockList, maxStorageUnitsPerTick) => {
      if (_taskState === 1) {
        const registryInfo = _readRegistryInfo(registryPos);
        if (registryInfo === false) { return false; }
        if (registryInfo === null) { return true; }

        const region = registryInfo[1];
        _lowX = region[0];
        _lowY = region[1];
        _lowZ = region[2];
        _highX = region[3];
        _highY = region[4];
        _highZ = region[5];

        const capacity = (_highX - _lowX + 1) * (_highY - _lowY + 1) * (_highZ - _lowZ + 1) - 1;
        const required = (blockList.length + 3) >> 2;
        if (capacity < required) {
          _log(_prefix + "Not enough space. Need " + required + " storage units, but region holds " + capacity + ".", 0);
          return true;
        }

        _registryChestPos = registryInfo[0];
        _loadedChunks = {};

        _storageX = _lowX;
        _storageY = _lowY;
        _storageZ = _lowZ;
        _blockCursor = 0;
        _registrySlotIndex = 1;
        _coordValueCount = 0;

        _taskState = 2;
      }

      let sx = _storageX;
      let sy = _storageY;
      let sz = _storageZ;
      
      let budget = maxStorageUnitsPerTick;
      const blockCount = blockList.length;
      let rawText, rawStart, rawEnd, escapedText, escapedCursor, escapedTextEnd, escapedSegmentEnd, backslashPosition, runLength;
      let block, bx, by, bz, chunkId, storageSlotBaseIndex, segmentIndex, segmentCount;
      while (_blockCursor < blockCount) {
        if (_taskState === 2) {
          sx++;
          if (sx > _highX) {
            sx = _lowX;
            sz++;
            if (sz > _highZ) {
              sz = _lowZ;
              sy++;
              if (sy > _highY) {
                // region overflow
                return true;
              }
            }
          }

          chunkId = (sx >> 5) + "|" + (sy >> 5) + "|" + (sz >> 5);
          if (!_loadedChunks[chunkId]) {
            if (_getBlockId(sx, sy, sz) === 1) { return false; }
            _loadedChunks[chunkId] = true;
          }

          _setBlock(sx, sy, sz, _blockType);
          _storageX = sx;
          _storageY = sy;
          _storageZ = sz;
          _storageChestPos = [sx, sy, sz];
          _partition = 0;

          _taskState = 3;
        }

        while (_partition < 4 && _blockCursor < blockCount) {
          if (_taskState === 3) {
            block = blockList[_blockCursor];
            if (!block?.length || block.length < 3) {
              _blockCursor++;
              continue;
            }

            bx = _floor(block[0]) | 0;
            by = _floor(block[1]) | 0;
            bz = _floor(block[2]) | 0;

            chunkId = (bx >> 5) + "|" + (by >> 5) + "|" + (bz >> 5);
            if (!_loadedChunks[chunkId]) {
              if (_getBlockId(bx, by, bz) === 1) { return false; }
              _loadedChunks[chunkId] = true;
            }

            rawText = _getBlockData(bx, by, bz)?.persisted?.shared?.text;
            if (rawText?.length > 0) {
              segmentIndex = 0;
              rawStart = 0;
              rawEnd = 0;

              escapedText = JSON.stringify(rawText);
      
              escapedCursor = 1;
              escapedTextEnd = escapedText.length - 1;
              while (escapedCursor < escapedTextEnd) {
                escapedSegmentEnd = escapedCursor + 1950;
                if (escapedSegmentEnd > escapedTextEnd) { escapedSegmentEnd = escapedTextEnd; }
                escapedSegmentEnd -= (escapedText[escapedSegmentEnd - 1] === "\\");

                while (escapedCursor < escapedSegmentEnd) {
                  backslashPosition = escapedText.indexOf("\\", escapedCursor);
                  if (backslashPosition === -1 || backslashPosition >= escapedSegmentEnd) {
                    runLength = escapedSegmentEnd - escapedCursor;
                    escapedCursor += runLength;
                    rawEnd += runLength;
                    break;
                  }
                  if (backslashPosition > escapedCursor) {
                    runLength = backslashPosition - escapedCursor;
                    escapedCursor += runLength;
                    rawEnd += runLength;
                  }
                  escapedCursor += 2;
                  rawEnd += 1;
                }
                _textSegmentsBuffer[segmentIndex] = rawText.slice(rawStart, rawEnd);
                segmentIndex++;
                rawStart = rawEnd;
              }
              _textSegmentsBuffer.length = segmentIndex;
              _taskState = 4;
            }
          }

          if (_taskState === 4) {
            storageSlotBaseIndex = _partition * 9;
            segmentIndex = 0;
            segmentCount = _textSegmentsBuffer.length;
            while (segmentIndex < segmentCount) {
              _storageSlotData.customAttributes._ = _textSegmentsBuffer[segmentIndex];
              _setStandardChestItemSlot(_storageChestPos, storageSlotBaseIndex + segmentIndex, _itemType, null, undefined, _storageSlotData);
              segmentIndex++;
            }
            _partition++;
            _taskState = 3;
          }

          _blockCursor++;
        }

        if (_coordValueCount >= 243) {
          _setStandardChestItemSlot(_registryChestPos, _registrySlotIndex, _itemType, null, undefined, _registrySlotData);
          _coordWriteBuffer.length = 0;
          _coordValueCount = 0;
          _registrySlotIndex++;
        }

        _coordWriteBuffer[_coordValueCount++] = sx;
        _coordWriteBuffer[_coordValueCount++] = sy;
        _coordWriteBuffer[_coordValueCount++] = sz;

        _taskState = 2;

        budget--;
        if (budget <= 0) { return false; }
      }

      _setStandardChestItemSlot(_registryChestPos, _registrySlotIndex, _itemType, null, undefined, _registrySlotData);

      _log(_prefix + "Built storage at (" + _registryChestPos[0] + ", " + _registryChestPos[1] + ", " + _registryChestPos[2] + ").", 2);

      _storageSlotData.customAttributes._ = null;
      _coordWriteBuffer.length = 0;
      _textSegmentsBuffer.length = 0;
      _loadedChunks = null;
      _registryChestPos = null;
      _storageChestPos = null;

      _taskState = 1;
      return true;
    };

    const _dispose_task = (registryPos, maxStorageUnitsPerTick) => {
      if (_taskState === 1) {
        const registryInfo = _readRegistryInfo(registryPos);
        if (registryInfo === false) { return false; }
        if (registryInfo === null) { return true; }

        _registryChestPos = registryInfo[0];
        _loadedChunks = {};

        _registryItems = _getStandardChestItems(_registryChestPos);

        _registrySlotIndex = 1;
        _coordIndex = 0;

        _taskState = 2;
      }

      let budget = maxStorageUnitsPerTick;
      let registryItem, sx, sy, sz, chunkId;
      while (registryItem = _registryItems[_registrySlotIndex]) {
        if (_taskState === 2) {
          _coordReadList = registryItem.attributes.customAttributes._;
          _coordIndex = 0;
          _coordValueCount = _coordReadList.length;
          _taskState = 3;
        }

        if (_taskState === 3) {
          while (_coordIndex < _coordValueCount) {
            sx = _coordReadList[_coordIndex];
            sy = _coordReadList[_coordIndex + 1];
            sz = _coordReadList[_coordIndex + 2];

            chunkId = (sx >> 5) + "|" + (sy >> 5) + "|" + (sz >> 5);
            if (!_loadedChunks[chunkId]) {
              if (_getBlockId(sx, sy, sz) === 1) { return false; }
              _loadedChunks[chunkId] = true;
            }

            _setBlock(sx, sy, sz, "Air");

            _coordIndex += 3;

            budget--;
            if (budget <= 0) { return false; }
          }

          _setStandardChestItemSlot(_registryChestPos, _registrySlotIndex, "Air");

          _registrySlotIndex++;
          _taskState = 2;
        }
      }

      _log(_prefix + "Disposed storage at (" + _registryChestPos[0] + ", " + _registryChestPos[1] + ", " + _registryChestPos[2] + ").", 2);

      _loadedChunks = null;
      _registryChestPos = null;
      _registryItems = null;
      _coordReadList = null;

      _taskState = 1;
      return true;
    };

    _SM_.create = (lowPosition, highPosition) => {
      _queue[_queue.length] = () => _create_task(lowPosition, highPosition);
    };

    _SM_.check = (registryPosition) => {
      _queue[_queue.length] = () => _check_task(registryPosition);
    };

    _SM_.build = (registryPosition, blockList, maxStorageUnitsPerTick = 8) => {
      _queue[_queue.length] = () => _build_task(registryPosition, blockList, maxStorageUnitsPerTick);
    };

    _SM_.dispose = (registryPosition, maxStorageUnitsPerTick = 32) => {
      _queue[_queue.length] = () => _dispose_task(registryPosition, maxStorageUnitsPerTick);
    };

    _SM_tick = () => {
      let isQueueActive = _queueCursor < _queue.length;
      while (isQueueActive) {
        try {
          if (!_queue[_queueCursor]()) { break; }
        } catch (error) {
          _taskState = 1;
          _log(_prefix + "Task error on tick - " + error.name + ": " + error.message, 0);
        }
        isQueueActive = ++_queueCursor < _queue.length;
      }
      if (!isQueueActive) {
        _queue.length = 0;
        _queueCursor = 0;
      }
    };
  }

    /* ---------------- Event Manager ---------------- */
  const _EM_setterByName = Object.create(null); // eventName -> closure setter
  const _EM_getterByName = Object.create(null); // eventName -> closure getter
  let _EM_isSetupComplete = false;
  let _EM_setupError = null;
  const _EM_eventNames = []; // [eventName, ...]
  let _EM_eventFallbacks = []; // [any, ...]
  let _EM_installCursor = 0;
  let _EM_join_handler;
  let _EM_tick_handler;
  let _EM_resetCursor;

  const _EM_setup = () => {
    if (_EM_isSetupComplete) { return; }

    const eventList = _CF_.EVENTS;
    const eventCount = eventList.length;
    let index = 0;
    let entry;
    while (index < eventCount) {
      entry = eventList[index];
      let eventName, captureInterrupts, fallbackValue;
      if (typeof entry === "string") {
        eventName = entry;
      } else {
        eventName = entry[0];
        captureInterrupts = !!entry[1];
        fallbackValue = entry[2];
      }
      if (eventName === "tick") {
        index++;
        continue;
      }
      if (eventName !== "onPlayerJoin") {
        _EM_eventNames[_EM_eventNames.length] = eventName;
        _EM_eventFallbacks[_EM_eventFallbacks.length] = fallbackValue;
        let handler = _NO_OP;
        _EM_setterByName[eventName] = (fn) => { handler = (typeof fn === "function") ? fn : _NO_OP };
        _EM_getterByName[eventName] = () => handler;
        if (captureInterrupts) {
          const _IF = _IF_;
          globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            _IF.en = 1;
            _IF.fn = handler;
            _IF.args = [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8];
            _IF.sid = 0;
            try {
              return handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
            } finally {
              _IF.en = 0;
            }
          };
        } else {
          globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            return handler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          };
        }
      } else {
        _EM_join_handler = _JM_dispatch;
        _EM_setterByName.onPlayerJoin = (fn) => { _EM_join_handler = (typeof fn === "function") ? fn : _NO_OP };
        _EM_getterByName.onPlayerJoin = () => _EM_join_handler;
        if (captureInterrupts) {
          const _IF = _IF_;
          globalThis.onPlayerJoin = function (arg0, arg1) {
            _IF.en = 1;
            _IF.fn = _EM_join_handler;
            _IF.args = [arg0, arg1];
            _IF.sid = 0;
            try {
              return _EM_join_handler(arg0, arg1);
            } finally {
              _IF.en = 0;
            }
          };
        } else {
          globalThis[eventName] = function (arg0, arg1) {
            return _EM_join_handler(arg0, arg1);
          };
        }
      }
      index++;
    }
    _EM_setterByName.tick = (fn) => { _EM_tick_handler = (typeof fn === "function") ? fn : _NO_OP; };
    _EM_getterByName.tick = () => _EM_tick_handler;
  };

  const _EM_install = () => {
    const eventCount = _EM_eventNames.length;
    while (_EM_installCursor < eventCount) {
      const eventName = _EM_eventNames[_EM_installCursor];
      const fallbackValue = _EM_eventFallbacks[_EM_installCursor];
      if (fallbackValue !== undefined) {
        api.setCallbackValueFallback(eventName, fallbackValue);
      }
      Object.defineProperty(globalThis, eventName, {
        configurable: true,
        set: _EM_setterByName[eventName],
        get: _EM_getterByName[eventName],
      });
      _EM_installCursor++;
    }
    if (_EM_join_handler) {
      Object.defineProperty(globalThis, "onPlayerJoin", {
        configurable: true,
        set: _EM_setterByName.onPlayerJoin,
        get: _EM_getterByName.onPlayerJoin,
      });
    }
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: _EM_setterByName.tick,
      get: _EM_getterByName.tick,
    });
    _EM_eventFallbacks = null;
  };

  const _EM_reset = () => {
    const eventCount = _EM_eventNames.length;
    while (_EM_resetCursor < eventCount) {
      _EM_setterByName[_EM_eventNames[_EM_resetCursor]](_NO_OP);
      _EM_resetCursor++;
    }
    if (_EM_join_handler) { _EM_join_handler = _NO_OP; }
  };

    /* ---------------- Tick Multiplexer ---------------- */
  let _TM_boot;
  let _TM_main;

  const _TM_dispatch = () => {
    _IF_.tick();
    _TM_main(50);
    _TM_boot();
  };

  const _TM_install = () => {
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: (fn) => { _TM_main = (typeof fn === "function") ? fn : _NO_OP; },
      get: () => _TM_main,
    });
    _TM_boot = _EM_tick_handler;
    _EM_tick_handler = _TM_dispatch;
  };

  const _TM_finalize = () => {
    Object.defineProperty(globalThis, "tick", {
      configurable: true,
      set: _EM_setterByName.tick,
      get: _EM_getterByName.tick,
    });
    _EM_tick_handler = _TM_main;
    _TM_boot = _NO_OP;
  };

    /* ---------------- Join Manager ---------------- */
  let _JM_resetOnReboot;
  let _JM_dequeueBudgetPerTick;
  let _JM_main;
  const _JM_queue = []; // [playerId, fromGameReset, ...]
  let _JM_playerStatus = {}; // playerId -> 0/1/2
  let _JM_queueCursor;

  const _JM_dispatch = (playerId, fromGameReset) => {
    const index = _JM_queue.length;
    _JM_queue[index] = playerId;
    _JM_queue[index + 1] = fromGameReset;
    _JM_playerStatus[playerId] = 1;
  };

  const _JM_install = () => {
    _EM_join_handler = _JM_dispatch;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: (fn) => { _JM_main = (typeof fn === "function") ? fn : _NO_OP; },
      get: () => _JM_main,
    });
  };

  const _JM_scan = () => {
    if (_JM_resetOnReboot || _OM_isPrimaryBoot) {
      const playerIds = api.getPlayerIds();
      let cursor = 0;
      let playerId, queueIndex;
      while (playerId = playerIds[cursor]) {
        if (!_JM_playerStatus[playerId]) {
          queueIndex = _JM_queue.length;
          _JM_queue[queueIndex] = playerId;
          _JM_queue[queueIndex + 1] = false;
          _JM_playerStatus[playerId] = 1;
        }
        cursor++;
      }
    }
  };

  const _JM_processQueue = () => {
    let budget = _JM_dequeueBudgetPerTick;
    let playerId, fromGameReset;
    while ((_JM_queueCursor < _JM_queue.length) && (budget > 0)) {
      playerId = _JM_queue[_JM_queueCursor];
      if (_JM_playerStatus[playerId] !== 2) {
        fromGameReset = _JM_queue[_JM_queueCursor + 1];
        _JM_playerStatus[playerId] = 2;
        _JM_queueCursor += 2;

        _IF_.en = 1;
        _IF_.fn = _JM_main;
        _IF_.args = [playerId, fromGameReset];
        _IF_.sid = 0;
        try {
          _JM_main(playerId, fromGameReset);
        } catch (error) {
          _IF_.en = 0;
          _log(_LOG_PREFIX + " JM: " + error.name + ": " + error.message, 0);
        }
        _IF_.en = 0;

        _JM_queueCursor -= 2;
        budget--;
      }
      _JM_queueCursor += 2;
    }
    return (_JM_queueCursor >= _JM_queue.length);
  };

  const _JM_finalize = () => {
    _EM_join_handler = _JM_main;
    Object.defineProperty(globalThis, "onPlayerJoin", {
      configurable: true,
      set: _EM_setterByName.onPlayerJoin,
      get: _EM_getterByName.onPlayerJoin,
    });
    _JM_queue.length = 0;
  };

    /* ---------------- Block Manager ---------------- */
  const _BM_prefix = _LOG_PREFIX + " BM: ";
  let _BM_executor;
  let _BM_blockList; // [[x, y, z, blockName], ...]
  const _BM_errorList = [null]; // [[name, message, x, y, z, partition?], ...]
  let _BM_isChestMode;
  let _BM_executionBudgetPerTick;
  let _BM_errorLimit;
  let _BM_errorIndex;
  let _BM_blockCursor;
  let _BM_blockCount;
  let _BM_isRegistryLoaded;
  let _BM_loadedChunks; // "cx|cy|cz" -> true
  let _BM_registryItems;
  let _BM_storageItems;
  let _BM_registrySlotIndex;
  let _BM_coordIndex;
  let _BM_partition;

  const _BM_blockExecutor = () => {
    let budget = _BM_executionBudgetPerTick;
    let block, bx, by, bz, code;
    while (_BM_blockCursor < _BM_blockCount) {
      block = _BM_blockList[_BM_blockCursor];
      if (!block?.length || block.length < 3) {
        _CL_.cursor = ++_BM_blockCursor;
        continue;
      }

      bx = block[0] = _floor(block[0]) | 0;
      by = block[1] = _floor(block[1]) | 0;
      bz = block[2] = _floor(block[2]) | 0;

      if ((block[3] = api.getBlock(bx, by, bz)) === "Unloaded") { return false; }

      try {
        code = _getBlockData(bx, by, bz)?.persisted?.shared?.text;
        _eval(code);
      } catch (error) {
        _BM_errorList[(++_BM_errorIndex) * +((_BM_errorList.length - 1) < _BM_errorLimit)] = [error.name, error.message, bx, by, bz];
      }

      _CL_.cursor = ++_BM_blockCursor;

      budget--;
      if (budget <= 0) { return false; }
    }

    return true;
  };

  const _BM_storageExecutor = () => {
    if (!_BM_isRegistryLoaded) {
      const registryPos = _BM_blockList[0];
      if (!registryPos?.length || registryPos.length < 3) { return true; }

      const rx = registryPos[0] = _floor(registryPos[0]) | 0;
      const ry = registryPos[1] = _floor(registryPos[1]) | 0;
      const rz = registryPos[2] = _floor(registryPos[2]) | 0;

      if (_getBlockId(rx, ry, rz) === 1) { return false; }

      _BM_registryItems = _getStandardChestItems([rx, ry, rz]);
      if (!_BM_registryItems[0]?.attributes?.customAttributes?.region) { return true; }

      _BM_isRegistryLoaded = true;
    }

    let budget = _BM_executionBudgetPerTick;
    let registryItem, coordList, coordCount, sx, sy, sz, chunkId, code, storageSlotBaseIndex, segmentIndex, storageItem;
    while (registryItem = _BM_registryItems[_BM_registrySlotIndex]) {
      coordList = registryItem.attributes.customAttributes._;
      coordCount = coordList.length - 2;
      while (_BM_coordIndex < coordCount) {
        sx = coordList[_BM_coordIndex];
        sy = coordList[_BM_coordIndex + 1];
        sz = coordList[_BM_coordIndex + 2];

        chunkId = (sx >> 5) + "|" + (sy >> 5) + "|" + (sz >> 5);
        if (!_BM_loadedChunks[chunkId]) {
          if (_getBlockId(sx, sy, sz) === 1) { return false; }
          _BM_loadedChunks[chunkId] = true;
        }

        if (_BM_partition === 0) {
          _BM_storageItems = _getStandardChestItems([sx, sy, sz]);
        }

        while (_BM_partition < 4) {
          code = "";
          storageSlotBaseIndex = _BM_partition * 9;
          segmentIndex = 0;
          while (segmentIndex < 9 && (storageItem = _BM_storageItems[storageSlotBaseIndex + segmentIndex])) {
            code += storageItem.attributes.customAttributes._;
            segmentIndex++;
          }

          if (segmentIndex === 0) {
            _CL_.cursor++;
            break;
          }

          try {
            _eval(code);
          } catch (error) {
            _BM_errorList[(++_BM_errorIndex) * +((_BM_errorList.length - 1) < _BM_errorLimit)] = [error.name, error.message, sx, sy, sz, _BM_partition];
          }

          _BM_partition++;
          _CL_.cursor++;

          budget--;
          if (budget <= 0) { return false; }
        }

        _BM_partition = 0;
        _BM_coordIndex += 3;
      }

      _BM_coordIndex = 0;
      _BM_registrySlotIndex++;
    }

    return true;
  };

  const _BM_install = () => {
    _BM_executor = _BM_isChestMode ? _BM_storageExecutor : _BM_blockExecutor; 
  };

  const _BM_finalize = () => {
    _BM_errorList[0] = null;
    _BM_loadedChunks = null;
    _BM_registryItems = null;
    _BM_storageItems = null;
  };

    /* ---------------- Boot Manager ---------------- */
  const _OM_prefix = _LOG_PREFIX + " OM: ";
  let _OM_bootState = -2;
  let _OM_isPrimaryBoot = true;
  let _OM_tickCount = -1;
  let _OM_isRunning = false;
  let _OM_bootDelayTicks;
  let _OM_showBootStatus;
  let _OM_showErrors;
  let _OM_showExecutionInfo;
  let _OM_loadDurationTicks;

  const _OM_logBootStatus = (showErrorCount) => {
    let message = "Code was loaded in " + (_OM_loadDurationTicks * 50) + " ms";
    const errorCount = _BM_errorList.length - 1;
    if (showErrorCount) {
      message += (errorCount > 0) ? (" with " + errorCount + " error" + ((errorCount === 1) ? "" : "s") + ".") : (" with 0 errors.");
    } else {
      message += ".";
    }
    _log(_OM_prefix + message, 1 + (errorCount <= 0));
  };

  const _OM_logErrors = (showSuccess) => {
    const errorCount = _BM_errorList.length - 1;
    if (errorCount > 0) {
      let message = "Code execution error" + ((errorCount === 1) ? "" : "s") + ":";
      let error;
      if (_BM_isChestMode) {
        for (let index = 1; index <= errorCount; index++) {
          error = _BM_errorList[index];
          message += "\n" + error[0] + " at (" + error[2] + ", " + error[3] + ", " + error[4] + ") in partition (" + error[5] + "): " + error[1];
        }
      } else {
        for (let index = 1; index <= errorCount; index++) {
          error = _BM_errorList[index];
          message += "\n" + error[0] + " at (" + error[2] + ", " + error[3] + ", " + error[4] + "): " + error[1];
        }
      }
      _log(_BM_prefix + message, 0);
    } else if (showSuccess) {
      _log(_BM_prefix + "No code execution errors.", 2);
    }
  };

  const _OM_logExecutionInfo = () => {
    let message = "";
    let block;
    if (_BM_isChestMode) {
      if (_BM_isRegistryLoaded) {
        block = _BM_blockList[0];
        message = "Executed storage data at (" + block[0] + ", " + block[1] + ", " + block[2] + ").";
      } else {
        message = "No storage data found.";
      }
    } else {
      let amount = 0;
      const blockCount = _BM_blockList.length;
      for (let index = 0; index < blockCount; index++) {
        block = _BM_blockList[index];
        if (block?.[3]) {
          message += "\n\"" + block[3] + "\" at (" + block[0] + ", " + block[1] + ", " + block[2] + ")";
          amount++;
        }
      }
      message = "Executed " + amount + " block" + ((amount === 1) ? "" : "s") + " data" + ((amount === 0) ? "." : ":") + message;
    }
    _log(_BM_prefix + message, 3);
  };

  const _OM_logReport = (showBootStatus, showErrors, showExecutionInfo) => {
    if (showBootStatus) {
      _OM_logBootStatus(showErrors);
    }
    if (showErrors) {
      _OM_logErrors(!showBootStatus);
    }
    if (showExecutionInfo) {
      _OM_logExecutionInfo();
    }
  };

  const _OM_tick = () => {
    _OM_tickCount++;

    if (_OM_bootState < 3) {
      if (_OM_bootState === -2) {
        if (!_EM_isSetupComplete && _OM_tickCount > 20) {
          const message = _LOG_PREFIX + " EM: Error on primary setup - " + _EM_setupError?.[0] + ": " + _EM_setupError?.[1] + ".";
          const playerIds = api.getPlayerIds();
          let cursor = 0;
          let playerId;
          while (playerId = playerIds[cursor]) {
            if (api.checkValid(playerId)) {
              api.kickPlayer(playerId, message);
            }
            cursor++;
          }
        }
        return;
      }

      if (_OM_bootState === 0) {
        _establish();
        _OM_bootState = 1;
      }

      if (_OM_bootState === 1) {
        if (_OM_tickCount < _OM_bootDelayTicks) { return; }
        _OM_bootState = 2;
      }

      if (_OM_bootState === 2) {
        if (_OM_isPrimaryBoot) {
          _EM_install();
        } else {
          _EM_reset();
        }
        if (_EM_join_handler) {
          _JM_install();
          _JM_scan();
        }
        _BM_install();
        _TM_install();
        _OM_bootState = 3;
      }
    }

    if (_OM_bootState === 3 && _BM_executor()) {
      _BM_finalize();
      _OM_bootState = 4 + !_EM_join_handler;
    }

    if (_OM_bootState === 4 && _JM_processQueue()) {
      _JM_finalize();
      _OM_bootState = 5;
    }

    if (_OM_bootState === 5) {
      _TM_finalize();
      _CL_.isPrimaryBoot = _OM_isPrimaryBoot = false;
      _CL_.isRunning = _OM_isRunning = false;
      _OM_bootState = -1;

      _OM_loadDurationTicks = _OM_tickCount - _OM_bootDelayTicks + 1;
      _OM_logReport(_OM_showBootStatus, _OM_showErrors, _OM_showExecutionInfo);
    }
  };

    /* ---------------- Code Loader ---------------- */
  _CL_.SM = _SM_;

  _CL_.config = _CF_;

  _CL_.reboot = () => {
    if (!_OM_isRunning) {
      _OM_tickCount = 0;
      _CL_.isRunning = _OM_isRunning = true;
      _CL_.cursor = 0;
      _EM_tick_handler = _OM_tick;
      _OM_bootState = 0;
    } else {
      _log(_OM_prefix + "Reboot request was denied.", 1);
    }
  };

  _CL_.logBootStatus = (showErrorCount = true) => {
    _OM_logBootStatus(showErrorCount);
  };

  _CL_.logErrors = (showSuccess = true) => {
    _OM_logErrors(showSuccess);
  };

  _CL_.logExecutionInfo = () => {
    _OM_logExecutionInfo();
  };

  _CL_.logReport = (showBootStatus = true, showErrors = true, showExecutionInfo = false) => {
    _OM_logReport(showBootStatus, showErrors, showExecutionInfo);
  };

    /* ---------------- Tick Event ---------------- */
  _EM_tick_handler = _OM_tick;
  globalThis.tick = function () {
    _EM_tick_handler(50);
    if (_SM_queue.length) { _SM_tick(); }
  };

    /* ---------------- Primary Boot ---------------- */
  try {
    _OM_tickCount = 0;
    _CL_.isRunning = _OM_isRunning = true;
    _CL_.cursor = 0;

    _EM_setup();

    const styles = _CF_.STYLES;
    for (let type = 0; type < 4; type++) {
      _LOG_STYLES[type] = [{
        str: "",
        style: {
          color: styles[type * 3],
          fontWeight: styles[type * 3 + 1],
          fontSize: styles[type * 3 + 2],
        }
      }];
    }

    const seal = Object.seal;
    const freeze = Object.freeze;
    seal(_CF_);
    seal(_CF_.OM);
    seal(_CF_.BM);
    seal(_CF_.JM);
    freeze(_CF_.STYLES);
    seal(_IF_);
    freeze(_SM_);
    seal(_CL_);

    _EM_isSetupComplete = true;
    _OM_bootState = 0;
  } catch (error) {
    _EM_setupError = [error.name, error.message];
  }

  globalThis.IF = _IF_;
  globalThis.CL = _CL_;

  void 0;
}

