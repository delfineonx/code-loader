// Code Loader v2026-05-04-0001
// Interruption Framework v2026-04-22-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

let config = {
  // [eventName | [eventName, captureInterrupts?, eventValueFallback?], ...]
  // [string | [string, boolean|number|null, any], ...]
  events: [
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
  */
  ],

  // [[number, number, number, detectedBlockName?], ...]
  // [[x, y, z, string?], ...]
  sources: [
  /* ... */
  ],

  show_boot_status: true,
  show_error_details: true,
  show_execution_details: false,

  execution_budget_per_tick: 8,
  join_budget_per_tick: 8,

  players_to_mark_as_joined: [], // null => all already-online players | [] => none | [playerId, ...] => only listed players
  handlers_to_preserve: null, // null => all handlers | [] => none | [eventName, ...] => only listed handlers
  globals_to_preserve: null, // null => all globals | [] => none | [propertyName, ...] => only listed globals

  shutdown_on_startup_error: true,
};

{
  /* ----------------------- Code Loader ----------------------- */

  /* -------------- Shared Variables / Internals --------------- */

  const _null = null;
  const _undefined = undefined;
  const _globalThis = globalThis;
  const _createObject = Object.create;
  const _EMPTY_FN = Object.freeze(function () { });
  const _CONTINUE_CB = Object.freeze(function () { return true; });
  const _indirectEval = eval;
  const _api = api;

  let _activeTickHandler = _EMPTY_FN;
  let _userTickHandler = _EMPTY_FN;

  let _activeJoinHandler;
  let _userJoinHandler;
  let _bootJoinQueue; // [playerId, fromGameReset, ...]
  let _bootJoinStatus; // {playerId -> 1 (enqueued) | 2 (processed)}
  let _joinBudgetPerTick;
  let _playersToMarkAsJoinedList; // [playerId, ...]
  let _playersToMarkAsJoinedSet; // {playerId -> 1}

  let _activeLeaveHandler;
  let _userLeaveHandler;
  let _bootLeaveRecords;

  const _managedEventNames = []; // [eventName, ...]
  let _eventValueFallbacks = []; // [eventValueFallback, ...]
  let _eventHandlerSetters = []; // [eventHandlerSetter, ...]
  let _eventHandlerGetters = []; // [eventHandlerGetter, ...]
  let _handlersToPreserveList; // [eventName, ...]
  let _handlersToPreserveSet; // {eventName -> 1}

  let _initialGlobalKeysList; // [propertyName, ...]
  const _initialGlobalKeysSet = _createObject(_null); // {propertyName -> 1}
  let _globalKeysToPreserveList; // [propertyName, ...]
  let _globalKeysToPreserveSet; // {propertyName -> 1}
  let _globalKeysSnapshotList; // [propertyName, ...]

  let _executionBudgetPerTick;
  let _executionErrorWriteIndex;

  let _bootConfig;
  let _bootErrorList = [_null, _null, _null, _null, _null, _null]; // [onStartName, onStartMessage, onLoadName, onLoadMessage, onEndName, onEndMessage, [name, message, x, y, z], ...]
  let _bootSourceList; // [[x, y, z, detectedBlockName], ...]
  let _bootHookContext;
  let _bootCursor = 0;

  const _CL_ = {
    config: config,
    isPrimaryBoot: true,
    stage: 0,
    cursor: 0,
    startTime: 0,
    endTime: 0,
    onStart: _CONTINUE_CB,
    onLoad: _CONTINUE_CB,
    onEnd: _CONTINUE_CB,
    bootJoinStatus: _null,
    bootLeaveRecords: _null,

    reboot: () => {
      if (_CL_.stage === 0) {
        _CL_.startTime = Date.now();
        _bootErrorList = [_null, _null, _null, _null, _null, _null];
        _bootCursor = 0;
        _CL_.cursor = 0;
        _CL_.stage = 1;
        _userTickHandler = _activeTickHandler;
        _activeTickHandler = _dispatchTick;
      } else {
        _log("CL: Reboot ignored; current boot has not finished.", 1);
      }
    },
    logBootStatus: (showErrorCount = true) => {
      let bootErrorList = _bootErrorList ?? _CL_._bootErrors;
      let bootErrorCount = 0;
      if (bootErrorList != _null) {
        bootErrorCount = (bootErrorList[0] != _null) + (bootErrorList[2] != _null) + (bootErrorList[4] != _null) + (bootErrorList.length - 6);
      }
      _log("CL: Boot completed in " + (_CL_.endTime - _CL_.startTime) + " ms" + (showErrorCount ? ((bootErrorCount > 0) ? (" with " + bootErrorCount + " error" + ((bootErrorCount === 1) ? "" : "s") + ".") : (" without errors.")) : "."), (1 << (bootErrorCount === 0)) << (bootErrorList == _null));
    },
    logErrorDetails: (showSuccessMessage = true) => {
      let bootErrorList = _bootErrorList ?? _CL_._bootErrors;
      if (bootErrorList == _null) {
        _log("CL: Boot error details are no longer available.", 4);
        return;
      }

      const hasOnStartError = (bootErrorList[0] != _null);
      const hasOnLoadError = (bootErrorList[2] != _null);
      const hasOnEndError = (bootErrorList[4] != _null);
      const executionErrorCount = (bootErrorList.length - 6);
      const bootErrorCount = hasOnStartError + hasOnLoadError + hasOnEndError + executionErrorCount;

      if (bootErrorCount > 0) {
        let message = "CL: Boot error details:";
        if (hasOnStartError) {
          message += "\n   onStart callback\n      " + bootErrorList[0] + ": " + bootErrorList[1];
        }
        if (hasOnLoadError) {
          message += "\n   onLoad callback\n      " + bootErrorList[2] + ": " + bootErrorList[3];
        }
        if (hasOnEndError) {
          message += "\n   onEnd callback\n      " + bootErrorList[4] + ": " + bootErrorList[5];
        }
        if (executionErrorCount > 0) {
          message += "\n   [" + executionErrorCount + "] code execution error" + ((executionErrorCount === 1) ? "" : "s");
          for (
            let errorIndex = 6, errorCount = bootErrorList.length, errorEntry = bootErrorList[errorIndex]; 
            errorIndex < errorCount; 
            errorEntry = bootErrorList[++errorIndex]
          ) {
            message += "\n      " + errorEntry[0] + " at (" + errorEntry[2] + ", " + errorEntry[3] + ", " + errorEntry[4] + "): " + errorEntry[1];
          }
        }
        _log(message, 0);
        return;
      }

      if (showSuccessMessage) {
        _log("CL: Boot completed without errors.", 2);
      }
    },
    logExecutionDetails: () => {
      let bootSourceList = _bootSourceList ?? _CL_._bootSources;
      if (bootSourceList == _null) {
        _log("CL: Execution details are no longer available.", 4);
        return;
      }

      let message = "";
      if (bootSourceList.length > 0) {
        let executedSourceCount = 0;
        for (
          let sourceIndex = 0, sourceCount = bootSourceList.length, sourceEntry = bootSourceList[sourceIndex]; 
          sourceIndex < sourceCount; 
          sourceEntry = bootSourceList[++sourceIndex]
        ) {
          if (sourceEntry?.[3]) {
            message += "\n\"" + sourceEntry[3] + "\" at (" + sourceEntry[0] + ", " + sourceEntry[1] + ", " + sourceEntry[2] + ")";
            executedSourceCount++;
          }
        }
        message = "Executed code from [" + executedSourceCount + "] source block" + ((executedSourceCount === 1) ? "" : "s") + ((executedSourceCount === 0) ? "." : ":") + message;
      } else {
        message = "No code executed; no positions were configured.";
      }
      _log("CL: " + message, 3);
    },
    logReport: (showBootStatus = true, showErrorDetails = true, showExecutionDetails = false) => {
      if (showBootStatus) {
        _CL_.logBootStatus(showErrorDetails);
      }
      if (showErrorDetails) {
        _CL_.logErrorDetails(!showBootStatus);
      }
      if (showExecutionDetails) {
        _CL_.logExecutionDetails();
      }
    },

    _log: null,
    _bootErrors: null,
    _bootSources: null,
  };

  const _log = _CL_._log = function (message, type) {
    const messagePayload = _log.payloads[type];
    const messageLength = message.length;

    if (messageLength <= 950) {
      messagePayload[0].str = message;
      _api.broadcastMessage(messagePayload);
    } else {
      let segmentStart = 0, segmentEnd, splitIndex;
      while (segmentStart < messageLength) {
        segmentEnd = segmentStart + 950;

        if (segmentEnd >= messageLength) {
          splitIndex = messageLength;
        } else {
          splitIndex = message.lastIndexOf("\n", segmentEnd - 1);
          if (splitIndex <= segmentStart) {
            splitIndex = segmentEnd;
          }
        }

        messagePayload[0].str = message.slice(segmentStart, splitIndex);
        _api.broadcastMessage(messagePayload);
        segmentStart = (splitIndex < segmentEnd) ? (splitIndex + 1) : splitIndex;
      }
    }

    messagePayload[0].str = "";
  };

  let _installEventBindings = () => {
    const eventConfigList = config.events;
    const seenEventNameSet = _createObject(_null);
    let managedEventIndex;

    for (
      let eventIndex = 0, eventCount = eventConfigList.length, eventEntry = eventConfigList[eventIndex]; 
      eventIndex < eventCount; 
      eventEntry = eventConfigList[++eventIndex]
    ) {
      let eventName, captureInterrupts = false, eventValueFallback;

      if (typeof eventEntry === "string") {
        eventName = eventEntry;
      } else if (Array.isArray(eventEntry) && typeof eventEntry[0] === "string") {
        eventName = eventEntry[0];
        captureInterrupts = !!eventEntry[1];
        eventValueFallback = eventEntry[2];
      } else {
        throw new TypeError("Invalid event entry at index " + eventIndex);
      }

      if (seenEventNameSet[eventName]) {
        throw new TypeError("Duplicate event name \"" + eventName + "\"");
      }
      seenEventNameSet[eventName] = 1;

      if (eventName === "tick") { continue; }

      managedEventIndex = _managedEventNames.length;
      _managedEventNames[managedEventIndex] = eventName;
      _eventValueFallbacks[managedEventIndex] = eventValueFallback;

      if (eventName === "onPlayerJoin") {
        _userJoinHandler = _EMPTY_FN;
        _activeJoinHandler = _EMPTY_FN;
        _eventHandlerSetters[managedEventIndex] = (fn) => {
          if (_CL_.stage < 3 || _CL_.stage > 14) {
            _activeJoinHandler = (typeof fn === "function") ? fn : _EMPTY_FN;
          } else {
            _userJoinHandler = (typeof fn === "function") ? fn : _EMPTY_FN;
          }
        };
        _eventHandlerGetters[managedEventIndex] = () => ((_CL_.stage < 3 || _CL_.stage > 14) ? _activeJoinHandler : _userJoinHandler);
        if (captureInterrupts) {
          const _IF = _IF_;
          _globalThis.onPlayerJoin = function (playerId, fromGameReset) {
            _IF.en = 1;
            _IF.fn = _activeJoinHandler;
            _IF.args = [playerId, fromGameReset];
            _IF.sid = 0;
            try {
              return _activeJoinHandler(playerId, fromGameReset);
            } finally {
              _IF.en = 0;
            }
          };
        } else {
          _globalThis.onPlayerJoin = function (playerId, fromGameReset) {
            return _activeJoinHandler(playerId, fromGameReset);
          };
        }
      } else if (eventName === "onPlayerLeave") {
        _userLeaveHandler = _EMPTY_FN;
        _activeLeaveHandler = _EMPTY_FN;
        _eventHandlerSetters[managedEventIndex] = (fn) => {
          if (_CL_.stage < 4 || _CL_.stage > 15) {
            _activeLeaveHandler = (typeof fn === "function") ? fn : _EMPTY_FN;
          } else {
            _userLeaveHandler = (typeof fn === "function") ? fn : _EMPTY_FN;
          }
        };
        _eventHandlerGetters[managedEventIndex] = () => ((_CL_.stage < 4 || _CL_.stage > 15) ? _activeLeaveHandler : _userLeaveHandler);
        if (captureInterrupts) {
          const _IF = _IF_;
          _globalThis.onPlayerLeave = function (playerId, serverIsShuttingDown) {
            _IF.en = 1;
            _IF.fn = _activeLeaveHandler;
            _IF.args = [playerId, serverIsShuttingDown];
            _IF.sid = 0;
            try {
              return _activeLeaveHandler(playerId, serverIsShuttingDown);
            } finally {
              _IF.en = 0;
            }
          };
        } else {
          _globalThis.onPlayerLeave = function (playerId, serverIsShuttingDown) {
            return _activeLeaveHandler(playerId, serverIsShuttingDown);
          };
        }
      } else {
        let _eventHandler = _EMPTY_FN;
        _eventHandlerSetters[managedEventIndex] = (fn) => { _eventHandler = (typeof fn === "function") ? fn : _EMPTY_FN };
        _eventHandlerGetters[managedEventIndex] = () => _eventHandler;
        if (captureInterrupts) {
          const _IF = _IF_;
          _globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            _IF.en = 1;
            _IF.fn = _eventHandler;
            _IF.args = [arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8];
            _IF.sid = 0;
            try {
              return _eventHandler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
            } finally {
              _IF.en = 0;
            }
          };
        } else {
          _globalThis[eventName] = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            return _eventHandler(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
          };
        }
      }
    }

    managedEventIndex = _managedEventNames.length;
    _managedEventNames[managedEventIndex] = "tick";
    _eventValueFallbacks[managedEventIndex] = _undefined;
    _eventHandlerSetters[managedEventIndex] = (fn) => {
      if (_CL_.stage === 0) {
        _activeTickHandler = (typeof fn === "function") ? fn : _EMPTY_FN;
      } else {
        _userTickHandler = (typeof fn === "function") ? fn : _EMPTY_FN;
      }
    };
    _eventHandlerGetters[managedEventIndex] = () => ((_CL_.stage === 0) ? _activeTickHandler : _userTickHandler);
    _globalThis.tick = function (dt) {
      _activeTickHandler(dt);
    };
  };

  let _primaryTick = () => {
    // install managed event accessors (+ apply fallback values, release setup metadata)
    if (_CL_.stage === -3) {
      const eventCount = _managedEventNames.length;
      while (_bootCursor < eventCount) {
        const eventName = _managedEventNames[_bootCursor];
        const eventValueFallback = _eventValueFallbacks[_bootCursor];
        if (eventValueFallback !== _undefined) {
          _api.setCallbackValueFallback(eventName, eventValueFallback);
        }
        _globalThis[eventName] = 1;
        Object.defineProperty(_globalThis, eventName, {
          configurable: true,
          set: _eventHandlerSetters[_bootCursor],
          get: _eventHandlerGetters[_bootCursor],
        });

        _bootCursor++;
      }

      _eventValueFallbacks = _undefined;
      _eventHandlerSetters = _undefined;
      _eventHandlerGetters = _undefined;

      _bootCursor = 0;
      _CL_.stage = -2;
    }

    // build initial global-key set (+ release setup metadata)
    if (_CL_.stage === -2) {
      const propertyCount = _initialGlobalKeysList.length;
      while (_bootCursor < propertyCount) {
        _initialGlobalKeysSet[_initialGlobalKeysList[_bootCursor]] = 1;
        _bootCursor++;
      }

      _initialGlobalKeysList = _undefined;

      _bootCursor = 0;
      _CL_.stage = -1;
    }

    // finish primary bootstrap
    if (_CL_.stage === -1) {
      _userTickHandler = _EMPTY_FN;
      _primaryTick = _undefined;

      _CL_.stage = 1;
      _indirectEval();
    }
  };

  let _shutdownTick = (message) => {
    const playerIdsList = _api.getPlayerIds();
    for (let playerIndex = 0, playerCount = playerIdsList.length, playerId; playerIndex < playerCount; playerIndex++) {
      playerId = playerIdsList[playerIndex];
      if (_api.checkValid(playerId)) {
        _api.kickPlayer(playerId, message);
      }
    }
  };

  const _dispatchTick = (dt) => {
    _IF_.tick();
    _userTickHandler(dt);
    _bootTick();
  };

  const _dispatchJoin = (playerId, fromGameReset) => {
    if (_bootJoinStatus[playerId] !== 1) {
      const queueIndex = _bootJoinQueue.length;
      _bootJoinQueue[queueIndex] = playerId;
      _bootJoinQueue[queueIndex + 1] = fromGameReset;
      _bootJoinStatus[playerId] = 1;
    }
  };

  const _dispatchLeave = (playerId, serverIsShuttingDown) => {
    _bootLeaveRecords[_bootLeaveRecords.length] = [playerId, _CL_.stage, _bootJoinStatus?.[playerId] | 0];
    _userLeaveHandler(playerId, serverIsShuttingDown);
  };

  const _bootTick = () => {
    if (_CL_.stage < 12) {
      // run onStart lifecycle hook (+ capture boot config, expose boot errors)
      if (_CL_.stage === 1) {
        if (_bootHookContext == _null) { _bootHookContext = _createObject(_null); }
        let isDone = true;
        try {
          isDone = !!_CL_.onStart(_bootHookContext);
        } catch (error) {
          _bootErrorList[0] = error.name;
          _bootErrorList[1] = error.message;
        }
        if (!isDone) { return; }

        _bootConfig = _CL_.config;
        _bootConfig = (typeof _bootConfig === "object") ? _bootConfig : {};

        _CL_._bootErrors = _bootErrorList;

        _bootHookContext = _undefined;

        _CL_.stage = 2 + ((_activeJoinHandler == _null) << (_activeLeaveHandler == _null));
      }

      // initialize boot-time join metadata and install join interceptor
      if (_CL_.stage === 2) {
        _joinBudgetPerTick = _bootConfig.join_budget_per_tick | 0;
        _joinBudgetPerTick = (_joinBudgetPerTick > 0) ? _joinBudgetPerTick : 1;
        _playersToMarkAsJoinedList = _bootConfig.players_to_mark_as_joined;
        _playersToMarkAsJoinedSet = _createObject(_null);

        _bootJoinQueue = [];
        _CL_.bootJoinStatus = _bootJoinStatus = _createObject(_null);

        _playersToMarkAsJoinedList ??= _api.getPlayerIds();

        _userJoinHandler = _activeJoinHandler;
        _activeJoinHandler = _dispatchJoin;

        _CL_.stage = 3 + (_activeLeaveHandler == _null);
      }

      // initialize boot-time leave metadata and install leave interceptor
      if (_CL_.stage === 3) {
        _CL_.bootLeaveRecords = _bootLeaveRecords = [];

        _userLeaveHandler = _activeLeaveHandler;
        _activeLeaveHandler = _dispatchLeave;

        _CL_.stage = 4;
      }

      // initialize and build preserved-handler set
      if (_CL_.stage === 4) {
        _handlersToPreserveList = _bootConfig.handlers_to_preserve;
        _handlersToPreserveSet ??= _createObject(_null);

        if (_handlersToPreserveList != _null) {
          const handlerCount = _handlersToPreserveList.length;
          while (_bootCursor < handlerCount) {
            _handlersToPreserveSet[_handlersToPreserveList[_bootCursor]] = 1;
            _bootCursor++;
          }
        }

        _bootCursor = 0;
        _CL_.stage = 5 + (_handlersToPreserveList == _null);
      }

      // reset non-preserved handlers
      if (_CL_.stage === 5) {
        const eventCount = _managedEventNames.length;
        let eventName;
        while (_bootCursor < eventCount) {
          eventName = _managedEventNames[_bootCursor];
          if (!(eventName in _handlersToPreserveSet)) {
            _globalThis[eventName] = _EMPTY_FN;
          }
          _bootCursor++;
        }

        _bootCursor = 0;
        _CL_.stage = 6;
      }

      // initialize and build preserved-global set (+ snapshot current globals)
      if (_CL_.stage === 6) {
        _globalKeysToPreserveList = _bootConfig.globals_to_preserve;
        _globalKeysToPreserveSet ??= _createObject(_null);

        if (_globalKeysToPreserveList != _null) {
          const propertyCount = _globalKeysToPreserveList.length;
          while (_bootCursor < propertyCount) {
            _globalKeysToPreserveSet[_globalKeysToPreserveList[_bootCursor]] = 1;
            _bootCursor++;
          }

          _globalKeysSnapshotList = Reflect.ownKeys(_globalThis);
        }

        _bootCursor = 0;
        _CL_.stage = 7 + (_globalKeysToPreserveList == _null);
      }

      // delete non-preserved globals
      if (_CL_.stage === 7) {
        const propertyCount = _globalKeysSnapshotList.length;
        let propertyName;
        while (_bootCursor < propertyCount) {
          propertyName = _globalKeysSnapshotList[_bootCursor];
          if (!(propertyName in _initialGlobalKeysSet || propertyName in _globalKeysToPreserveSet)) {
            delete _globalThis[propertyName];
          }
          _bootCursor++;
        }

        _bootCursor = 0;
        _CL_.stage = 8;
      }

      // release preservation setup metadata for handlers and globals
      if (_CL_.stage === 8) {
        _handlersToPreserveList = _undefined;
        _handlersToPreserveSet = _undefined;
        _globalKeysToPreserveList = _undefined;
        _globalKeysToPreserveSet = _undefined;
        _globalKeysSnapshotList = _undefined;

        _CL_.stage = 9 | ((_activeJoinHandler == _null) << 1);
      }

      // build pre-marked player set
      if (_CL_.stage === 9) {
        const playerCount = _playersToMarkAsJoinedList.length;
        while (_bootCursor < playerCount) {
          _playersToMarkAsJoinedSet[_playersToMarkAsJoinedList[_bootCursor]] = 1;
          _bootCursor++;
        }

        _bootCursor = 0;
        _CL_.stage = 10;
      }

      // scan online players and enqueue boot joins (+ release setup metadata)
      if (_CL_.stage === 10) {
        const playerIdsList = _api.getPlayerIds();
        for (let playerIndex = 0, playerCount = playerIdsList.length, playerId, queueIndex; playerIndex < playerCount; playerIndex++) {
          playerId = playerIdsList[playerIndex];
          if (!(playerId in _bootJoinStatus)) {
            queueIndex = _bootJoinQueue.length;
            _bootJoinQueue[queueIndex] = playerId;
            _bootJoinQueue[queueIndex + 1] = false;
            _bootJoinStatus[playerId] = 1;
          }
          if (playerId in _playersToMarkAsJoinedSet) {
            _bootJoinStatus[playerId] = 2;
          }
        }

        _playersToMarkAsJoinedList = _undefined;
        _playersToMarkAsJoinedSet = _undefined;

        _CL_.stage = 11;
      }

      // initialize source execution state (+ expose boot sources)
      if (_CL_.stage === 11) {
        _bootSourceList = _bootConfig.sources;
        _bootSourceList = _CL_._bootSources = Array.isArray(_bootSourceList) ? _bootSourceList : [];
        _executionBudgetPerTick = _bootConfig.execution_budget_per_tick | 0;
        _executionBudgetPerTick = (_executionBudgetPerTick > 0) ? _executionBudgetPerTick : 1;
        _executionErrorWriteIndex = 6;

        _CL_.stage = 12 | (_bootSourceList.length === 0);
      }
    }

    if (_CL_.stage < 16) {
      // execute configured sources (+ release metadata)
      if (_CL_.stage === 12) {
        const _mathFloor = _globalThis.Math.floor;
        let remainingBudget = _executionBudgetPerTick;
        let blockEntry, blockX, blockY, blockZ, sourceCode;
        while (_CL_.cursor < _bootSourceList.length) {
          blockEntry = _bootSourceList[_CL_.cursor];
          if ((blockEntry?.length | 0) < 3) {
            _CL_.cursor++;
            continue;
          }

          blockX = blockEntry[0] = _mathFloor(blockEntry[0]) | 0;
          blockY = blockEntry[1] = _mathFloor(blockEntry[1]) | 0;
          blockZ = blockEntry[2] = _mathFloor(blockEntry[2]) | 0;

          if ((blockEntry[3] = _api.getBlock(blockX, blockY, blockZ)) === "Unloaded") { return false; }

          try {
            sourceCode = _api.getBlockData(blockX, blockY, blockZ)?.persisted?.shared?.text;
            _indirectEval(sourceCode);
          } catch (error) {
            _bootErrorList[_executionErrorWriteIndex] = [error.name, error.message, blockX, blockY, blockZ];
            _executionErrorWriteIndex++;
          }

          _CL_.cursor++;

          remainingBudget--;
          if (remainingBudget <= 0) { return; }
        }

        _executionBudgetPerTick = _undefined;
        _executionErrorWriteIndex = _undefined;

        _CL_.stage = 13;
        _indirectEval();
      }

      // run onLoad lifecycle hook
      if (_CL_.stage === 13) {
        if (_bootHookContext == _null) { _bootHookContext = _createObject(_null); }
        let isDone = true;
        try {
          isDone = !!_CL_.onLoad(_bootHookContext);
        } catch (error) {
          _bootErrorList[2] = error.name;
          _bootErrorList[3] = error.message;
        }
        if (!isDone) { return; }
        _bootHookContext = _undefined;

        _CL_.stage = 14 + ((_activeJoinHandler == _null) << (_activeLeaveHandler == _null));
      }

      // process queued joins and restore the final join handler (+ release metadata)
      if (_CL_.stage === 14) {
        /*
        // recommended safety guard
        onPlayerJoin = (playerId, fromGameReset) => {
          if (!api.checkValid(playerId)) { return; }
          // your onPlayerJoin logic...
        };
        */

        let remainingBudget = _joinBudgetPerTick;
        let playerId, fromGameReset;
        while ((_bootCursor < _bootJoinQueue.length) && (remainingBudget > 0)) {
          playerId = _bootJoinQueue[_bootCursor];
          if (_bootJoinStatus[playerId] !== 2) {
            _indirectEval();
            fromGameReset = _bootJoinQueue[_bootCursor + 1];
            _bootJoinStatus[playerId] = 2;
            _bootCursor += 2;

            _IF_.en = 1;
            _IF_.fn = _userJoinHandler;
            _IF_.args = [playerId, fromGameReset];
            _IF_.sid = 0;

            try {
              _userJoinHandler(playerId, fromGameReset);
            } catch (error) {
              _IF_.en = 0;
              _log("CL [onPlayerJoin]: " + error.name + ": " + error.message, 0);
            }
            _IF_.en = 0;

            _bootCursor -= 2;
            remainingBudget--;
          }
          _bootCursor += 2;
        }
        if (_bootCursor < _bootJoinQueue.length) { return; }
        
        _bootJoinQueue = _undefined;
        _bootJoinStatus = _undefined;
        _joinBudgetPerTick = _undefined;

        _activeJoinHandler = _userJoinHandler;
        _userJoinHandler = _EMPTY_FN;

        _bootCursor = 0;
        _CL_.stage = 15 + (_activeLeaveHandler == _null);
        _indirectEval();
      }

      // restore the final leave handler (+ release metadata)
      if (_CL_.stage === 15) {
        /*
        // recommended safety guard
        onPlayerLeave = (playerId, serverIsShuttingDown) => {
          if (CL.stage > 1 && CL.stage < 16) { return; }
          // your onPlayerLeave logic...
        };
        */

        _bootLeaveRecords = _undefined;

        _activeLeaveHandler = _userLeaveHandler;
        _userLeaveHandler = _EMPTY_FN;

        _CL_.stage = 16;
      }
    }

    // run onEnd lifecycle hook
    if (_CL_.stage === 16) {
      if (_bootHookContext == _null) { _bootHookContext = _createObject(_null); }
      let isDone = true;
      try {
        isDone = !!_CL_.onEnd(_bootHookContext);
      } catch (error) {
        _bootErrorList[4] = error.name;
        _bootErrorList[5] = error.message;
      }
      if (!isDone) { return; }
      _bootHookContext = _undefined;

      _CL_.stage = 17;
    }

    // finalize the boot, report results, clear temporary metadata, restore the final tick handler
    if (_CL_.stage === 17) {
      _CL_.endTime = Date.now();

      _CL_.onStart = _CONTINUE_CB;
      _CL_.onLoad = _CONTINUE_CB;
      _CL_.onEnd = _CONTINUE_CB;
      
      _CL_.bootJoinStatus = _null;
      _CL_.bootLeaveRecords = _null;

      _CL_.logReport(!!_bootConfig.show_boot_status, !!_bootConfig.show_error_details, !!_bootConfig.show_execution_details);

      _bootConfig = _undefined;
      _bootErrorList = _undefined;
      _bootSourceList = _undefined;

      _activeTickHandler = _userTickHandler;
      _userTickHandler = _EMPTY_FN;

      _CL_.isPrimaryBoot = false;
      _CL_.stage = 0;
    }
  };

  /* ------------------ Interruption Framework ----------------- */

  let _IF_;
  {
    const _EMPTY_HANDLER = Object.freeze(function () { });
    const _EMPTY_ARGS = Object.freeze([]);
    const _EMPTY_TASK = [_EMPTY_HANDLER, _EMPTY_ARGS, 0, 0];

    const _taskQueue = [];
    let _activeTask = _EMPTY_TASK;
    let _isExternalInterrupt = true;

    let _readIndex = 0;
    let _writeIndex = 0;
    let _queueSize = 0;

    const _IF = _IF_ = {
      en: 0, // enable/disable interrupt capture
      fn: _EMPTY_HANDLER, // handler to resume
      args: _EMPTY_ARGS, // arguments passed (may include shared cache/context object)
      rcnt: 0, // retry counter (resume attempts)
      sid: 0, // state id (user-managed resume state identifier)

      noArgs: _EMPTY_ARGS,

      inspect: () => {
        return [_taskQueue, _queueSize, _readIndex, _writeIndex, _isExternalInterrupt];
      },
      reset: () => {
        _queueSize = 0;
        _readIndex = 0;
        _writeIndex = 0;
        _taskQueue.length = 0;
        
        _activeTask = _EMPTY_TASK;

        _IF.en = 0;
        _IF.fn = _EMPTY_HANDLER;
        _IF.args = _EMPTY_ARGS;
        _IF.rcnt = 0;
        _IF.sid = 0;

        _isExternalInterrupt = true;
      },
      tick: () => {
        _IF.fn = _EMPTY_HANDLER;
        _IF.args = _EMPTY_ARGS;
        _IF.sid = 0;
        if (!_queueSize) { return; }

        _isExternalInterrupt = false;

        let taskError = null;
        while (_queueSize) {
          _activeTask = _taskQueue[_readIndex];

          _IF.args = _activeTask[1];
          _IF.rcnt = ++_activeTask[2];
          _IF.sid = _activeTask[3];
          try {
            _activeTask[0](..._IF.args);
          } catch (error) {
            taskError = error;
          }

          _taskQueue[_readIndex] = undefined;
          _readIndex++;
          _queueSize--;

          if (taskError) {
            _log("IF [" + (_activeTask[0]?.name || "<anonymous>") + "]: " + taskError.name + ": " + taskError.message, 0);
            taskError = null;
          }
        }
        _readIndex = 0;
        _writeIndex = 0;
        _taskQueue.length = 0;
        
        _activeTask = _EMPTY_TASK;

        _IF.en = 0;
        _IF.rcnt = 0;

        _isExternalInterrupt = true;
      },
    };
    
    Object.defineProperty(globalThis.InternalError.prototype, "name", {
      configurable: true,
      get: () => {
        if (_isExternalInterrupt) {
          if (_IF.en) {
            _IF.en = 0;
            _taskQueue[_writeIndex] = [_IF.fn, _IF.args, 0, _IF.sid];
            _writeIndex++;
            _queueSize++;
            _IF.fn = _EMPTY_HANDLER;
            _IF.args = _EMPTY_ARGS;
          }
        } else {
          _IF.en = 0;
          _activeTask[1] = _IF.args;
          _activeTask[3] = _IF.sid;
          _activeTask = _EMPTY_TASK;
          _IF.rcnt = 0;
          _isExternalInterrupt = true;
        }
        return "InternalError";
      },
    });
  }

  /* ---------------------- Loader Startup --------------------- */

  try {
    _CL_.startTime = Date.now();

    // [color, fontWeight, fontSize] per log type
    const logStylePresets = [
      "#FF775E", "500", "0.95rem", // error   (0)
      "#FFC23D", "500", "0.95rem", // warning (1)
      "#20DD69", "500", "0.95rem", // success (2)
      "#52B2FF", "500", "0.95rem", // info    (3)
      "#B06CFF", "500", "0.95rem", // bug     (4)
    ];
    const logPayloads = _log.payloads = [];
    for (let type = 0; type <= 4; type++) {
      logPayloads[type] = [{
        str: "",
        style: {
          color: logStylePresets[type * 3],
          fontWeight: logStylePresets[type * 3 + 1],
          fontSize: logStylePresets[type * 3 + 2],
        }
      }];
    }

    _installEventBindings();

    Object.seal(_IF_);

    _globalThis.IF = _IF_;
    _globalThis.CL = _CL_;
    _initialGlobalKeysList = Reflect.ownKeys(_globalThis);

    config = _undefined;
    _installEventBindings = _undefined;
    _shutdownTick = _undefined;

    _CL_.stage = -3;
    _userTickHandler = _primaryTick;
    _activeTickHandler = _dispatchTick;
  } catch (error) {
    const startupErrorMessage = "CL [Startup Error]: " + error.name + ": " + error.message + ".";
    _log(startupErrorMessage, 0);
    if (!!config?.shutdown_on_startup_error) {
      _activeTickHandler = () => _shutdownTick(startupErrorMessage);
    }
  }

  void 0;
}

