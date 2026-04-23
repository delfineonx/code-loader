// Code Loader v2026-04-23-0001
// Interruption Framework v2026-04-22-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

let config = {
  events: [],
  sources: [],
  show_boot_status: true,
  show_error_details: true,
  show_execution_details: false,
  use_storage_mode: false,
  execution_budget_per_tick: 8,
  join_budget_per_tick: 8,
  players_to_mark_as_joined: [],
  handlers_to_preserve: null,
  globals_to_preserve: null,
  enable_storage_manager: false,
  shutdown_on_startup_error: true,
};

{
  const _null=null,
  _undefined=undefined,
  _globalThis=globalThis,
  _createObject=Object.create,
  _EMPTY_FN=Object.freeze(function(){}),
  _CONTINUE_CB=Object.freeze(function(){return !0}),
  _indirectEval=eval,
  _mathFloor=Math.floor,
  _api=api;
  let _activeTickHandler=_EMPTY_FN,
  _userTickHandler=_EMPTY_FN,
  _activeJoinHandler,
  _userJoinHandler,
  _bootJoinQueue,
  _bootJoinStatus,
  _joinBudgetPerTick,
  _playersToMarkAsJoinedList,
  _playersToMarkAsJoinedSet,
  _activeLeaveHandler,
  _userLeaveHandler,
  _bootLeaveRecords,
  _managedEventNames=[],
  _eventValueFallbacks=[],
  _eventHandlerSetters=[],
  _eventHandlerGetters=[],
  _handlersToPreserveList,
  _handlersToPreserveSet,
  _initialGlobalKeysList,
  _initialGlobalKeysSet=_createObject(_null),
  _globalKeysToPreserveList,
  _globalKeysToPreserveSet,
  _globalKeysSnapshotList,
  _executeSourceCode,
  _useStorageMode,
  _executionBudgetPerTick,
  _executionErrorWriteIndex,
  _isRegistryLoaded,
  _loadedChunkSet,
  _registryItems,
  _containerItems,
  _registrySlotIndex,
  _coordOffset,
  _containerUnitIndex,
  _containerPartitionIndex,
  _bootConfig,
  _bootErrorList=[_null,_null,_null,_null,_null,_null],
  _bootSourceList,
  _bootHookContext,
  _bootCursor=0;
  const _CL_={
    config:config,
    isPrimaryBoot:!0,
    stage:0,
    cursor:0,
    startTime:0,
    endTime:0,
    onStart:_CONTINUE_CB,
    onLoad:_CONTINUE_CB,
    onEnd:_CONTINUE_CB,
    bootJoinStatus:_null,
    bootLeaveRecords:_null,
    reboot:()=>{
      if(_CL_.stage===0){
        _CL_.startTime=Date.now();
        _bootErrorList=[_null,_null,_null,_null,_null,_null];
        _bootCursor=0;
        _CL_.cursor=0;
        _CL_.stage=1;
        _userTickHandler=_activeTickHandler;
        _activeTickHandler=_dispatchTick
      }else{
        _log("CL: Reboot ignored; boot is already in progress.",1)
      }
    },
    logBootStatus:(showErrorCount=!0)=>{
      let bootErrorList=_bootErrorList??_CL_._bootErrors,
      bootErrorCount=0;
      if(bootErrorList!=_null){
        bootErrorCount=(bootErrorList[0]!=_null)+(bootErrorList[2]!=_null)+(bootErrorList[4]!=_null)+(bootErrorList.length-6)
      }
      let message="CL: Boot completed in "+(_CL_.endTime-_CL_.startTime)+" ms";
      message+=showErrorCount?bootErrorCount>0?" with "+bootErrorCount+" error"+(bootErrorCount===1?"":"s")+".":" without errors.":".";
      _log(message,1<<(bootErrorCount===0)<<(bootErrorList==_null))
    },
    logErrorDetails:(showSuccessMessage=!0)=>{
      let bootErrorList=_bootErrorList??_CL_._bootErrors;
      if(bootErrorList==_null){
        _log("CL: Boot error details are no longer available.",4);
        return
      }
      let hasOnStartError=bootErrorList[0]!=_null,
      hasOnLoadError=bootErrorList[2]!=_null,
      hasOnEndError=bootErrorList[4]!=_null,
      executionErrorCount=bootErrorList.length-6,
      bootErrorCount=hasOnStartError+hasOnLoadError+hasOnEndError+executionErrorCount;
      if(bootErrorCount>0){
        let message="CL: Boot error details:";
        if(hasOnStartError){
          message+="\n   onStart callback\n      "+bootErrorList[0]+": "+bootErrorList[1]
        }
        if(hasOnLoadError){
          message+="\n   onLoad callback\n      "+bootErrorList[2]+": "+bootErrorList[3]
        }
        if(hasOnEndError){
          message+="\n   onEnd callback\n      "+bootErrorList[4]+": "+bootErrorList[5]
        }
        if(executionErrorCount>0){
          message+="\n   ["+executionErrorCount+"] code execution error"+(executionErrorCount===1?"":"s");
          let errorEntry;
          if(_useStorageMode){
            for(let errorIndex=6,errorCount=bootErrorList.length;errorIndex<errorCount;errorIndex++){
              errorEntry=bootErrorList[errorIndex];
              message+="\n      "+errorEntry[0]+" at ("+errorEntry[2]+", "+errorEntry[3]+", "+errorEntry[4]+"), container index ("+errorEntry[5]+"), partition ("+errorEntry[6]+"): "+errorEntry[1]
            }
          }else{
            for(let errorIndex=6,errorCount=bootErrorList.length;errorIndex<errorCount;errorIndex++){
              errorEntry=bootErrorList[errorIndex];
              message+="\n      "+errorEntry[0]+" at ("+errorEntry[2]+", "+errorEntry[3]+", "+errorEntry[4]+"): "+errorEntry[1]
            }
          }
        }
        _log(message,0);
        return
      }
      if(showSuccessMessage){
        _log("CL: Boot completed without errors.",2)
      }
    },
    logExecutionDetails:()=>{
      let bootSourceList=_bootSourceList??_CL_._bootSources;
      if(bootSourceList==_null){
        _log("CL: Execution details are no longer available.",4);
        return
      }
      let message="";
      if(bootSourceList.length>0){
        let sourceEntry;
        if(_useStorageMode){
          if(_isRegistryLoaded){
            sourceEntry=bootSourceList[0];
            message="Executed code from storage using registry at ("+sourceEntry[0]+", "+sourceEntry[1]+", "+sourceEntry[2]+")."
          }else{
            message="No code executed; no storage registry was found."
          }
        }else{
          let executedBlockCount=0;
          for(let blockIndex=0,blockCount=bootSourceList.length;blockIndex<blockCount;blockIndex++){
            sourceEntry=bootSourceList[blockIndex];
            if(sourceEntry?.[3]){
              message+='\n"'+sourceEntry[3]+'" at ('+sourceEntry[0]+", "+sourceEntry[1]+", "+sourceEntry[2]+")";
              executedBlockCount++
            }
          }
          message="Executed code from ["+executedBlockCount+"] source block"+(executedBlockCount===1?"":"s")+(executedBlockCount===0?".":":")+message
        }
      }else{
        message="No code executed; no positions were configured."
      }
      _log("CL: "+message,3)
    },
    logReport:(showBootStatus=!0,showErrorDetails=!0,showExecutionDetails=!1)=>{
      if(showBootStatus){
        _CL_.logBootStatus(showErrorDetails)
      }
      if(showErrorDetails){
        _CL_.logErrorDetails(!showBootStatus)
      }
      if(showExecutionDetails){
        _CL_.logExecutionDetails()
      }
    }
  };
  const _log=_CL_._log=function(message,type){
    let messagePayload=_log.payloads[type],
    messageLength=message.length;
    if(messageLength<=950){
      messagePayload[0].str=message;
      _api.broadcastMessage(messagePayload)
    }else{
      let segmentStart=0,segmentEnd,splitIndex;
      while(segmentStart<messageLength){
        segmentEnd=segmentStart+950;
        if(segmentEnd>=messageLength){
          splitIndex=messageLength
        }else{
          splitIndex=message.lastIndexOf("\n",segmentEnd-1);
          if(splitIndex<=segmentStart){
            splitIndex=segmentEnd
          }
        }
        messagePayload[0].str=message.slice(segmentStart,splitIndex);
        _api.broadcastMessage(messagePayload);
        segmentStart=splitIndex<segmentEnd?splitIndex+1:splitIndex
      }
    }
    messagePayload[0].str=""
  };
  let _installEventBindings=()=>{
    let tickEventName="tick",
    onPlayerJoinEventName="onPlayerJoin",
    onPlayerLeaveEventName="onPlayerLeave",
    eventConfigList=_CL_.config.events,
    seenEventNameSet=_createObject(_null),
    eventEntry,managedEventIndex;
    for(let eventIndex=0,eventCount=eventConfigList.length;eventIndex<eventCount;eventIndex++){
      eventEntry=eventConfigList[eventIndex];
      let eventName,captureInterrupts=!1,eventValueFallback;
      if(typeof eventEntry==="string"){
        eventName=eventEntry
      }else if(Array.isArray(eventEntry)&&typeof eventEntry[0]==="string"){
        eventName=eventEntry[0];
        captureInterrupts=!!eventEntry[1];
        eventValueFallback=eventEntry[2]
      }else{
        throw new TypeError("Invalid event entry at index "+eventIndex)
      }
      if(seenEventNameSet[eventName]){
        throw new TypeError('Duplicate event name "'+eventName+'"');
      }
      seenEventNameSet[eventName]=1;
      if(eventName===tickEventName){continue}
      managedEventIndex=_managedEventNames.length;
      _managedEventNames[managedEventIndex]=eventName;
      _eventValueFallbacks[managedEventIndex]=eventValueFallback;
      if(eventName===onPlayerJoinEventName){
        _userJoinHandler=_EMPTY_FN;
        _activeJoinHandler=_EMPTY_FN;
        _eventHandlerSetters[managedEventIndex]=fn=>{
          if(_CL_.stage<3||_CL_.stage>14){
            _activeJoinHandler=typeof fn==="function"?fn:_EMPTY_FN
          }else{
            _userJoinHandler=typeof fn==="function"?fn:_EMPTY_FN
          }
        };
        _eventHandlerGetters[managedEventIndex]=()=>_CL_.stage<3||_CL_.stage>14?_activeJoinHandler:_userJoinHandler;
        if(captureInterrupts){
          const _IF=_IF_;
          _globalThis[onPlayerJoinEventName]=function(playerId,fromGameReset){
            _IF.en=1;
            _IF.fn=_activeJoinHandler;
            _IF.args=[playerId,fromGameReset];
            _IF.sid=0;
            try{
              return _activeJoinHandler(playerId,fromGameReset)
            }finally{
              _IF.en=0
            }
          }
        }else{
          _globalThis[onPlayerJoinEventName]=function(playerId,fromGameReset){
            return _activeJoinHandler(playerId,fromGameReset)
          }
        }
      }else if(eventName===onPlayerLeaveEventName){
        _userLeaveHandler=_EMPTY_FN;
        _activeLeaveHandler=_EMPTY_FN;
        _eventHandlerSetters[managedEventIndex]=fn=>{
          if(_CL_.stage<4||_CL_.stage>15){
            _activeLeaveHandler=typeof fn==="function"?fn:_EMPTY_FN
          }else{
            _userLeaveHandler=typeof fn==="function"?fn:_EMPTY_FN
          }
        };
        _eventHandlerGetters[managedEventIndex]=()=>_CL_.stage<4||_CL_.stage>15?_activeLeaveHandler:_userLeaveHandler;
        if(captureInterrupts){
          const _IF=_IF_;
          _globalThis[onPlayerLeaveEventName]=function(playerId,serverIsShuttingDown){
            _IF.en=1;
            _IF.fn=_activeLeaveHandler;
            _IF.args=[playerId,serverIsShuttingDown];
            _IF.sid=0;
            try{
              return _activeLeaveHandler(playerId,serverIsShuttingDown)
            }finally{
              _IF.en=0
            }
          }
        }else{
          _globalThis[onPlayerLeaveEventName]=function(playerId,serverIsShuttingDown){
            return _activeLeaveHandler(playerId,serverIsShuttingDown)
          }
        }
      }else{
        let _eventHandler=_EMPTY_FN;
        _eventHandlerSetters[managedEventIndex]=fn=>{_eventHandler=typeof fn==="function"?fn:_EMPTY_FN};
        _eventHandlerGetters[managedEventIndex]=()=>_eventHandler;
        if(captureInterrupts){
          const _IF=_IF_;
          _globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
            _IF.en=1;
            _IF.fn=_eventHandler;
            _IF.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];
            _IF.sid=0;
            try{
              return _eventHandler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
            }finally{
              _IF.en=0
            }
          }
        }else{
          _globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
            return _eventHandler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
          }
        }
      }
    }
    managedEventIndex=_managedEventNames.length;
    _managedEventNames[managedEventIndex]=tickEventName;
    _eventValueFallbacks[managedEventIndex]=_undefined;
    _eventHandlerSetters[managedEventIndex]=fn=>{
      if(_CL_.stage===0){
        _activeTickHandler=typeof fn==="function"?fn:_EMPTY_FN
      }else{
        _userTickHandler=typeof fn==="function"?fn:_EMPTY_FN
      }
    };
    _eventHandlerGetters[managedEventIndex]=()=>_CL_.stage===0?_activeTickHandler:_userTickHandler
  };
  let _primaryTick=()=>{
    if(_CL_.stage===-3){
      let eventCount=_managedEventNames.length;
      while(_bootCursor<eventCount){
        let eventName=_managedEventNames[_bootCursor],
        eventValueFallback=_eventValueFallbacks[_bootCursor];
        if(eventValueFallback!==_undefined){
          _api.setCallbackValueFallback(eventName,eventValueFallback)
        }
        _globalThis[eventName]=1;
        Object.defineProperty(_globalThis,eventName,{
          configurable:!0,
          set:_eventHandlerSetters[_bootCursor],
          get:_eventHandlerGetters[_bootCursor]
        });
        _bootCursor++
      }
      _eventValueFallbacks=_undefined;
      _eventHandlerGetters=_undefined;
      _eventHandlerGetters=_undefined;
      _bootCursor=0;
      _CL_.stage=-2
    }
    if(_CL_.stage===-2){
      let propertyCount=_initialGlobalKeysList.length;
      while(_bootCursor<propertyCount){
        _initialGlobalKeysSet[_initialGlobalKeysList[_bootCursor]]=1;
        _bootCursor++
      }
      _initialGlobalKeysList=_undefined;
      _bootCursor=0;
      _CL_.stage=-1
    }
    if(_CL_.stage===-1){
      _userTickHandler=_EMPTY_FN;
      _primaryTick=_undefined;
      _CL_.stage=1;
      _indirectEval()
    }
  };
  let _shutdownTick=(message)=>{
    let playerIdsList=_api.getPlayerIds(),
    playerIndex=0,playerId;
    while(playerIndex<playerIdsList.length){
      playerId=playerIdsList[playerIndex];
      if(_api.checkValid(playerId)){
        _api.kickPlayer(playerId,message)
      }
      playerIndex++
    }
  };
  const _dispatchTick=()=>{
    _IF_.tick();
    _userTickHandler(50);
    _bootTick()
  };
  const _dispatchJoin=(playerId,fromGameReset)=>{
    if(_bootJoinStatus[playerId]!==1){
      let queueIndex=_bootJoinQueue.length;
      _bootJoinQueue[queueIndex]=playerId;
      _bootJoinQueue[queueIndex+1]=fromGameReset;
      _bootJoinStatus[playerId]=1
    }
  };
  const _dispatchLeave=(playerId,serverIsShuttingDown)=>{
    _bootLeaveRecords[_bootLeaveRecords.length]=[playerId,_CL_.stage,_bootJoinStatus?.[playerId]|0];
    _userLeaveHandler(playerId,serverIsShuttingDown)
  };
  const _executeBlockData=()=>{
    let remainingBudget=_executionBudgetPerTick,
    blockEntry,blockX,blockY,blockZ,sourceCode;
    while(_CL_.cursor<_bootSourceList.length){
      blockEntry=_bootSourceList[_CL_.cursor];
      if((blockEntry?.length|0)<3){
        _CL_.cursor++;
        continue
      }
      blockX=blockEntry[0]=_mathFloor(blockEntry[0])|0;
      blockY=blockEntry[1]=_mathFloor(blockEntry[1])|0;
      blockZ=blockEntry[2]=_mathFloor(blockEntry[2])|0;
      if((blockEntry[3]=_api.getBlock(blockX,blockY,blockZ))==="Unloaded"){return !1}
      try{
        sourceCode=_api.getBlockData(blockX,blockY,blockZ)?.persisted?.shared?.text;
        _indirectEval(sourceCode)
      }catch(error){
        _bootErrorList[_executionErrorWriteIndex]=[error.name,error.message,blockX,blockY,blockZ];
        _executionErrorWriteIndex++
      }
      _CL_.cursor++;
      remainingBudget--;
      if(remainingBudget<=0){return !1}
    }
    return !0
  };
  const _executeStorageData=()=>{
    if(!_isRegistryLoaded){
      let registryEntry=_bootSourceList[0];
      if((registryEntry?.length|0)<3){return !0}
      let registryX=registryEntry[0]=_mathFloor(registryEntry[0])|0,
      registryY=registryEntry[1]=_mathFloor(registryEntry[1])|0,
      registryZ=registryEntry[2]=_mathFloor(registryEntry[2])|0;
      if(_api.getBlockId(registryX,registryY,registryZ)===1){return !1}
      _registryItems=_api.getStandardChestItems([registryX,registryY,registryZ]);
      if(_registryItems[0]?.attributes?.customAttributes?.region==_null){return !0}
      _isRegistryLoaded=!0
    }
    let remainingBudget=_executionBudgetPerTick,
    registrySlotItem,containerCoordList,coordValueCount,containerX,containerY,containerZ,chunkId,sourceCode,partitionSlotOffset,segmentIndex,containerSlotItem;
    while(registrySlotItem=_registryItems[_registrySlotIndex]){
      containerCoordList=registrySlotItem.attributes.customAttributes._;
      coordValueCount=containerCoordList.length;
      while(_coordOffset+2<coordValueCount){
        containerX=containerCoordList[_coordOffset];
        containerY=containerCoordList[_coordOffset+1];
        containerZ=containerCoordList[_coordOffset+2];
        chunkId=(containerX>>5)+"|"+(containerY>>5)+"|"+(containerZ>>5);
        if(!(chunkId in _loadedChunkSet)){
          if(_api.getBlockId(containerX,containerY,containerZ)===1){return !1}
          _loadedChunkSet[chunkId]=1
        }
        if(_containerPartitionIndex===0){
          _containerItems=_api.getStandardChestItems([containerX,containerY,containerZ])
        }
        while(_containerPartitionIndex<4){
          sourceCode="";
          partitionSlotOffset=_containerPartitionIndex*9;
          segmentIndex=0;
          while(segmentIndex<9&&(containerSlotItem=_containerItems[partitionSlotOffset+segmentIndex])!=_null){
            sourceCode+=containerSlotItem.attributes.customAttributes._;
            segmentIndex++
          }
          try{
            _indirectEval(sourceCode)
          }catch(error){
            _bootErrorList[_executionErrorWriteIndex]=[error.name,error.message,containerX,containerY,containerZ,_containerUnitIndex,_containerPartitionIndex];
            _executionErrorWriteIndex++
          }
          _containerPartitionIndex++;
          _CL_.cursor++;
          remainingBudget--;
          if(remainingBudget<=0){return !1}
        }
        _containerPartitionIndex=0;
        _containerUnitIndex++;
        _coordOffset+=3
      }
      _coordOffset=0;
      _registrySlotIndex++
    }
    return !0
  };
  const _bootTick=()=>{
    if(_CL_.stage<12){
      if(_CL_.stage===1){
        if(_bootHookContext==_null){_bootHookContext=_createObject(_null)}
        let isDone=!0;
        try{
          isDone=!!_CL_.onStart(_bootHookContext)
        }catch(error){
          _bootErrorList[0]=error.name;
          _bootErrorList[1]=error.message
        }
        if(!isDone){return}
        _bootConfig=_CL_.config;
        _bootConfig=typeof _bootConfig==="object"?_bootConfig:{};
        _CL_._bootErrors=_bootErrorList;
        _bootHookContext=_undefined;
        _CL_.stage=2+((_activeJoinHandler==_null)<<(_activeLeaveHandler==_null))
      }
      if(_CL_.stage===2){
        _joinBudgetPerTick=_bootConfig.join_budget_per_tick|0;
        _joinBudgetPerTick=_joinBudgetPerTick>0?_joinBudgetPerTick:1;
        _playersToMarkAsJoinedList=_bootConfig.players_to_mark_as_joined;
        _playersToMarkAsJoinedSet=_createObject(_null);
        _bootJoinQueue=[];
        _CL_.bootJoinStatus=_bootJoinStatus=_createObject(_null);
        _playersToMarkAsJoinedList??=_api.getPlayerIds();
        _userJoinHandler=_activeJoinHandler;
        _activeJoinHandler=_dispatchJoin;
        _CL_.stage=3+(_activeLeaveHandler==_null)
      }
      if(_CL_.stage===3){
        _CL_.bootLeaveRecords=_bootLeaveRecords=[];
        _userLeaveHandler=_activeLeaveHandler;
        _activeLeaveHandler=_dispatchLeave;
        _CL_.stage=4
      }
      if(_CL_.stage===4){
        _handlersToPreserveList=_bootConfig.handlers_to_preserve;
        _handlersToPreserveSet??=_createObject(_null);
        if(_handlersToPreserveList!=_null){
          let handlerCount=_handlersToPreserveList.length;
          while(_bootCursor<handlerCount){
            _handlersToPreserveSet[_handlersToPreserveList[_bootCursor]]=1;
            _bootCursor++
          }
        }
        _bootCursor=0;
        _CL_.stage=5+(_handlersToPreserveList==_null)
      }
      if(_CL_.stage===5){
        let eventCount=_managedEventNames.length,
        eventName;
        while(_bootCursor<eventCount){
          eventName=_managedEventNames[_bootCursor];
          if(!(eventName in _handlersToPreserveSet)){
            _globalThis[eventName] =_EMPTY_FN
          }
          _bootCursor++
        }
        _bootCursor=0;
        _CL_.stage=6
      }
      if(_CL_.stage===6){
        _globalKeysToPreserveList=_bootConfig.globals_to_preserve;
        _globalKeysToPreserveSet??=_createObject(_null);
        if(_globalKeysToPreserveList!=_null){
          let propertyCount=_globalKeysToPreserveList.length;
          while(_bootCursor<propertyCount){
            _globalKeysToPreserveSet[_globalKeysToPreserveList[_bootCursor]]=1;
            _bootCursor++
          }
          _globalKeysSnapshotList=Reflect.ownKeys(_globalThis)
        }
        _bootCursor=0;
        _CL_.stage=7+(_globalKeysToPreserveList==_null)
      }
      if(_CL_.stage===7){
        let propertyCount=_globalKeysSnapshotList.length,
        propertyName;
        while(_bootCursor<propertyCount){
          propertyName=_globalKeysSnapshotList[_bootCursor];
          if(!(propertyName in _initialGlobalKeysSet||propertyName in _globalKeysToPreserveSet)){
            delete _globalThis[propertyName]
          }
          _bootCursor++
        }
        _bootCursor=0;
        _CL_.stage=8
      }
      if(_CL_.stage===8){
        _handlersToPreserveList=_undefined;
        _handlersToPreserveSet=_undefined;
        _globalKeysToPreserveList=_undefined;
        _globalKeysToPreserveSet=_undefined;
        _globalKeysSnapshotList=_undefined;
        _CL_.stage=9|(_activeJoinHandler==_null)<<1
      }
      if(_CL_.stage===9){
        let playerCount=_playersToMarkAsJoinedList.length;
        while(_bootCursor<playerCount){
          _playersToMarkAsJoinedSet[_playersToMarkAsJoinedList[_bootCursor]]=1;
          _bootCursor++
        }
        _bootCursor=0;
        _CL_.stage=10
      }
      if(_CL_.stage===10){
        let playerIdsList=_api.getPlayerIds(),
        playerIndex=0,playerId,queueIndex;
        while(playerIndex<playerIdsList.length){
          playerId=playerIdsList[playerIndex];
          if(!(playerId in _bootJoinStatus)){
            queueIndex=_bootJoinQueue.length;
            _bootJoinQueue[queueIndex]=playerId;
            _bootJoinQueue[queueIndex+1]=!1;
            _bootJoinStatus[playerId]=1
          }
          if(playerId in _playersToMarkAsJoinedSet){
            _bootJoinStatus[playerId]=2
          }
          playerIndex++
        }
        _playersToMarkAsJoinedList=_undefined;
        _playersToMarkAsJoinedSet=_undefined;
        _CL_.stage=11
      }
      if(_CL_.stage===11){
        _bootSourceList=_bootConfig.sources;
        _bootSourceList=_CL_._bootSources=Array.isArray(_bootSourceList)?_bootSourceList:[];
        if(_bootSourceList.length>0){
          _useStorageMode=!!_bootConfig.use_storage_mode;
          _executionBudgetPerTick=_bootConfig.execution_budget_per_tick|0;
          _executionBudgetPerTick=_executionBudgetPerTick>0?_executionBudgetPerTick:1;
          _executionErrorWriteIndex=6;
          if(_useStorageMode){
            _isRegistryLoaded=!1;
            _registrySlotIndex=1;
            _coordOffset=0;
            _containerUnitIndex=0;
            _containerPartitionIndex=0;
            _loadedChunkSet=_createObject(_null);
            _executeSourceCode=_executeStorageData
          }else{
            _executeSourceCode=_executeBlockData
          }
        }
        _CL_.stage=12|_bootSourceList.length===0
      }
    }
    if(_CL_.stage<16){
      if(_CL_.stage===12){
        if(!_executeSourceCode()){return}
        if(_useStorageMode){
          _registrySlotIndex=_undefined;
          _coordOffset=_undefined;
          _containerUnitIndex=_undefined;
          _containerPartitionIndex=_undefined;
          _loadedChunkSet=_undefined;
          _registryItems=_undefined;
          _containerItems=_undefined
        }
        _executionBudgetPerTick=_undefined;
        _executionErrorWriteIndex=_undefined;
        _executeSourceCode=_undefined;
        _CL_.stage=13;
        _indirectEval()
      }
      if(_CL_.stage===13){
        if(_bootHookContext==_null){_bootHookContext=_createObject(_null)}
        let isDone=!0;
        try{
          isDone=!!_CL_.onLoad(_bootHookContext)
        }catch(error){
          _bootErrorList[2]=error.name;
          _bootErrorList[3]=error.message
        }
        if(!isDone){return}
        _bootHookContext=_undefined;
        _CL_.stage=14+((_activeJoinHandler==_null)<<(_activeLeaveHandler==_null))
      }
      if(_CL_.stage===14){
        let remainingBudget=_joinBudgetPerTick,
        playerId,fromGameReset;
        while(_bootCursor<_bootJoinQueue.length&&remainingBudget>0){
          playerId=_bootJoinQueue[_bootCursor];
          if(_bootJoinStatus[playerId]!==2){
            _indirectEval();
            fromGameReset=_bootJoinQueue[_bootCursor+1];
            _bootJoinStatus[playerId]=2;
            _bootCursor+=2;
            _IF_.en=1;
            _IF_.fn=_userJoinHandler;
            _IF_.args=[playerId,fromGameReset];
            _IF_.sid=0;
            try{
              _userJoinHandler(playerId,fromGameReset)
            }catch(error){
              _IF_.en=0;
              _log("CL [onPlayerJoin]: "+error.name+": "+error.message,0)
            }
            _IF_.en=0;
            _bootCursor-=2;
            remainingBudget--
          }
          _bootCursor+=2
        }
        if(_bootCursor<_bootJoinQueue.length){return}
        _joinBudgetPerTick=_undefined;
        _bootJoinQueue=_undefined;
        _bootJoinStatus=_undefined;
        _activeJoinHandler=_userJoinHandler;
        _userJoinHandler=_EMPTY_FN;
        _bootCursor=0;
        _CL_.stage=15+(_activeLeaveHandler==_null);
        _indirectEval()
      }
      if(_CL_.stage===15){
        _bootLeaveRecords=_undefined;
        _activeLeaveHandler=_userLeaveHandler;
        _userLeaveHandler=_EMPTY_FN;
        _CL_.stage=16
      }
    }
    if(_CL_.stage===16){
      if(_bootHookContext==_null){_bootHookContext=_createObject(_null)}
      let isDone=!0;
      try{
        isDone=!!_CL_.onEnd(_bootHookContext)
      }catch(error){
        _bootErrorList[4]=error.name;
        _bootErrorList[5]=error.message
      }
      if(!isDone){return}
      _bootHookContext=_undefined;
      _CL_.stage=17
    }
    if(_CL_.stage===17){
      _CL_.endTime=Date.now();
      _CL_.onStart=_CONTINUE_CB;
      _CL_.onLoad=_CONTINUE_CB;
      _CL_.onEnd=_CONTINUE_CB;
      _CL_.bootJoinStatus=_null;
      _CL_.bootLeaveRecords=_null;
      _CL_.logReport(!!_bootConfig.show_boot_status,!!_bootConfig.show_error_details,!!_bootConfig.show_execution_details);
      _bootConfig=_undefined;
      _bootErrorList=_undefined;
      _bootSourceList=_undefined;
      _activeTickHandler=_userTickHandler;
      _userTickHandler=_EMPTY_FN;
      _CL_.isPrimaryBoot=!1;
      _CL_.stage=0
    }
  };
  let _IF_;
  {
    const _EMPTY_HANDLER=Object.freeze(function(){}),
    _EMPTY_ARGS=Object.freeze([]),
    _EMPTY_TASK=[_EMPTY_HANDLER,_EMPTY_ARGS,0,0],
    _taskQueue=[];
    let _activeTask=_EMPTY_TASK,
    _isExternalInterrupt=!0,
    _readIndex=0,
    _writeIndex=0,
    _queueSize=0;
    const _IF=_IF_={
      en:0,
      fn:_EMPTY_HANDLER,
      args:_EMPTY_ARGS,
      rcnt:0,
      sid:0,
      noArgs:_EMPTY_ARGS,
      inspect:()=>{
        return[_taskQueue,_queueSize,_readIndex,_writeIndex,_isExternalInterrupt]
      },
      reset:()=>{
        _queueSize=0;
        _readIndex=0;
        _writeIndex=0;
        _taskQueue.length=0;
        _activeTask=_EMPTY_TASK;
        _IF.en=0;
        _IF.fn=_EMPTY_HANDLER;
        _IF.args=_EMPTY_ARGS;
        _IF.rcnt=0;
        _IF.sid=0;
        _isExternalInterrupt=!0
      },
      tick:()=>{
        _IF.fn=_EMPTY_HANDLER;
        _IF.args=_EMPTY_ARGS;
        _IF.sid=0;
        if(!_queueSize){return}
        _isExternalInterrupt=!1;
        let taskError=null;
        while(_queueSize){
          _activeTask=_taskQueue[_readIndex];
          _IF.args=_activeTask[1];
          _IF.rcnt=++_activeTask[2];
          _IF.sid=_activeTask[3];
          try{
            _activeTask[0](..._IF.args)
          }catch(error){
            taskError=error
          }
          _taskQueue[_readIndex]=undefined;
          _readIndex++;
          _queueSize--;
          if(taskError){
            _log("IF ["+(_activeTask[0]?.name||"<anonymous>")+"]: "+taskError.name+": "+taskError.message,0);
            taskError=null
          }
        }
        _readIndex=0;
        _writeIndex=0;
        _taskQueue.length=0;
        _activeTask=_EMPTY_TASK;
        _IF.en=0;
        _IF.rcnt=0;
        _isExternalInterrupt=!0
      }
    };
    Object.defineProperty(globalThis.InternalError.prototype,"name",{
      configurable:!0,
      get:()=>{
        if(_isExternalInterrupt){
          if(_IF.en){
            _IF.en=0;
            _taskQueue[_writeIndex]=[_IF.fn,_IF.args,0,_IF.sid];
            _writeIndex++;
            _queueSize++;
            _IF.fn=_EMPTY_HANDLER;
            _IF.args=_EMPTY_ARGS
          }
        }else{
          _IF.en=0;
          _activeTask[1]=_IF.args;
          _activeTask[3]=_IF.sid;
          _activeTask=_EMPTY_TASK;
          _IF.rcnt=0;
          _isExternalInterrupt=!0
        }
        return"InternalError"
      }
    })
  }
  if(!!config?.enable_storage_manager){
    let _LOG_PREFIX="CL [SM]: ",
    _taskQueue=[],
    _taskIndex=0,
    _taskStage=1,
    _CHEST_BLOCK_NAME="Bedrock",
    _CHEST_ITEM_NAME="Boat",
    _containerItemPayload={customAttributes:{_:_null}},
    _registryItemPayload={customAttributes:{_:[]}},
    _containerCoordWriteList=_registryItemPayload.customAttributes._,
    _containerCoordReadList,
    _textSegments=[],
    _loadedChunkSet,
    _registryPosition,
    _containerPosition,
    _registryItems,
    _registrySlotIndex,
    _sourceBlockIndex,
    _containerPartitionIndex,
    _coordOffset,
    _coordValueCount,
    _minX,
    _minY,
    _minZ,
    _maxX,
    _maxY,
    _maxZ,
    _containerX,
    _containerY,
    _containerZ;
    const _readRegistryMetadata=registryPosition=>{
      if((registryPosition?.length|0)<3){
        _log(_LOG_PREFIX+"Invalid registry position; expected [x, y, z].",1);
        return _null
      }
      let registryX=_mathFloor(registryPosition[0])|0,
      registryY=_mathFloor(registryPosition[1])|0,
      registryZ=_mathFloor(registryPosition[2])|0;
      if(_api.getBlockId(registryX,registryY,registryZ)===1){return !1}
      let normalizedRegistryPosition=[registryX,registryY,registryZ],
      region=_api.getStandardChestItemSlot(normalizedRegistryPosition,0)?.attributes?.customAttributes?.region;
      if((region?.length|0)<6){
        _log(_LOG_PREFIX+"No registry metadata was found at ("+registryX+", "+registryY+", "+registryZ+").",1);
        return _null
      }
      return[normalizedRegistryPosition,region]
    };
    const _createRegistry=(minPosition,maxPosition)=>{
      if((minPosition?.length|0)<3||(maxPosition?.length|0)<3){
        _log(_LOG_PREFIX+"Invalid storage region: both positions must be [x, y, z].",1);
        return !0
      }
      let minX=_mathFloor(minPosition[0])|0,
      minY=_mathFloor(minPosition[1])|0,
      minZ=_mathFloor(minPosition[2])|0,
      maxX=_mathFloor(maxPosition[0])|0,
      maxY=_mathFloor(maxPosition[1])|0,
      maxZ=_mathFloor(maxPosition[2])|0;
      if(minX>maxX||minY>maxY||minZ>maxZ){
        _log(_LOG_PREFIX+"Invalid storage region: min position ("+minX+", "+minY+", "+minZ+") must be <= max position ("+maxX+", "+maxY+", "+maxZ+") on all axes.",1);
        return !0
      }
      if(_api.getBlockId(minX,minY,minZ)===1){return !1}
      _api.setBlock(minX,minY,minZ,_CHEST_BLOCK_NAME);
      _api.setStandardChestItemSlot([minX,minY,minZ],0,_CHEST_ITEM_NAME,_null,_undefined,{
        customAttributes:{
          region:[minX,minY,minZ,maxX,maxY,maxZ]
        }
      });
      _log(_LOG_PREFIX+"Created registry at ("+minX+", "+minY+", "+minZ+").",2);
      return !0
    };
    const _inspectRegistry=registryPosition=>{
      let registryMetadata=_readRegistryMetadata(registryPosition);
      if(registryMetadata===!1){return !1}
      if(registryMetadata===_null){return !0}
      let region=registryMetadata[1];
      _log(_LOG_PREFIX+"Configured storage region: ("+region[0]+", "+region[1]+", "+region[2]+") -> ("+region[3]+", "+region[4]+", "+region[5]+").",3);
      return !0
    };
    const _buildStorage=(registryPosition,sourceBlockList,containerBudgetPerTick)=>{
      if(_taskStage===1){
        let registryMetadata=_readRegistryMetadata(registryPosition);
        if(registryMetadata===!1){return !1}
        if(registryMetadata===_null){return !0}
        let region=registryMetadata[1];
        _minX=region[0];
        _minY=region[1];
        _minZ=region[2];
        _maxX=region[3];
        _maxY=region[4];
        _maxZ=region[5];
        let capacity=(_maxX-_minX+1)*(_maxY-_minY+1)*(_maxZ-_minZ+1)-1,
        required=sourceBlockList.length+3>>2;
        if(capacity<required){
          _log(_LOG_PREFIX+"Not enough space: need "+required+" container units, but region holds "+capacity+".",0);
          return !0
        }
        _containerCoordWriteList.length=0;
        _textSegments.length=0;
        _loadedChunkSet=_createObject(_null);
        _registryPosition=registryMetadata[0];
        _containerX=_minX;
        _containerY=_minY;
        _containerZ=_minZ;
        _sourceBlockIndex=0;
        _registrySlotIndex=1;
        _coordValueCount=0;
        _taskStage=2
      }
      let containerX=_containerX,
      containerY=_containerY,
      containerZ=_containerZ,
      remainingBudget=containerBudgetPerTick,
      rawText,rawStart,rawEnd,escapedText,escapedCursor,escapedTextEnd,escapedSegmentEnd,escapedCharPosition,runLength,
      sourceBlock,blockX,blockY,blockZ,chunkId,partitionSlotOffset,segmentIndex,segmentCount;
      while(_sourceBlockIndex<sourceBlockList.length){
        if(_taskStage===2){
          containerX++;
          if(containerX>_maxX){
            containerX=_minX;
            containerZ++;
            if(containerZ>_maxZ){
              containerZ=_minZ;
              containerY++;
              if(containerY>_maxY){
                return !0
              }
            }
          }
          chunkId=(containerX>>5)+"|"+(containerY>>5)+"|"+(containerZ>>5);
          if(!(chunkId in _loadedChunkSet)){
            if(_api.getBlockId(containerX,containerY,containerZ)===1){return !1}
            _loadedChunkSet[chunkId]=1
          }
          _api.setBlock(containerX,containerY,containerZ,_CHEST_BLOCK_NAME);
          _containerX=containerX;
          _containerY=containerY;
          _containerZ=containerZ;
          _containerPosition=[containerX,containerY,containerZ];
          _containerPartitionIndex=0;
          _taskStage=3
        }
        while(_containerPartitionIndex<4&&_sourceBlockIndex<sourceBlockList.length){
          if(_taskStage===3){
            sourceBlock=sourceBlockList[_sourceBlockIndex];
            if((sourceBlock?.length|0)<3){
              _sourceBlockIndex++;
              continue
            }
            blockX=_mathFloor(sourceBlock[0])|0;
            blockY=_mathFloor(sourceBlock[1])|0;
            blockZ=_mathFloor(sourceBlock[2])|0;
            chunkId=(blockX>>5)+"|"+(blockY>>5)+"|"+(blockZ>>5);
            if(!(chunkId in _loadedChunkSet)){
              if(_api.getBlockId(blockX,blockY,blockZ)===1){return !1}
              _loadedChunkSet[chunkId]=1
            }
            rawText=_api.getBlockData(blockX,blockY,blockZ)?.persisted?.shared?.text??"";
            escapedText=JSON.stringify(rawText);
            if(escapedText.length<=1952){
              _textSegments[0]=rawText;
              _textSegments.length=1
            }else{
              segmentIndex=0;
              rawStart=0;
              rawEnd=0;
              escapedCursor=1;
              escapedTextEnd=escapedText.length-1;
              while(escapedCursor<escapedTextEnd){
                escapedSegmentEnd=escapedCursor+1950;
                if(escapedSegmentEnd>escapedTextEnd){escapedSegmentEnd=escapedTextEnd}
                escapedSegmentEnd-=escapedText[escapedSegmentEnd-1]==="\\";
                while(escapedCursor<escapedSegmentEnd){
                  escapedCharPosition=escapedText.indexOf("\\",escapedCursor);
                  if(escapedCharPosition===-1||escapedCharPosition>=escapedSegmentEnd){
                    runLength=escapedSegmentEnd-escapedCursor;
                    escapedCursor+=runLength;
                    rawEnd+=runLength;
                    break
                  }
                  if(escapedCharPosition>escapedCursor){
                    runLength=escapedCharPosition-escapedCursor;
                    escapedCursor+=runLength;
                    rawEnd+=runLength
                  }
                  escapedCursor+=2;
                  rawEnd+=1
                }
                _textSegments[segmentIndex]=rawText.slice(rawStart,rawEnd);
                segmentIndex++;
                rawStart=rawEnd
              }
              _textSegments.length=segmentIndex
            }
            _taskStage=4
          }
          if(_taskStage===4){
            partitionSlotOffset=_containerPartitionIndex*9;
            segmentIndex=0;
            segmentCount=_textSegments.length;
            while(segmentIndex<segmentCount){
              _containerItemPayload.customAttributes._=_textSegments[segmentIndex];
              _api.setStandardChestItemSlot(_containerPosition,partitionSlotOffset+segmentIndex,_CHEST_ITEM_NAME,_null,_undefined,_containerItemPayload);
              segmentIndex++
            }
            _containerPartitionIndex++;
            _taskStage=3
          }
          _sourceBlockIndex++
        }
        if(_coordValueCount>=243){
          _api.setStandardChestItemSlot(_registryPosition,_registrySlotIndex,_CHEST_ITEM_NAME,_null,_undefined,_registryItemPayload);
          _containerCoordWriteList.length=0;
          _coordValueCount=0;
          _registrySlotIndex++
        }
        _containerCoordWriteList[_coordValueCount++]=containerX;
        _containerCoordWriteList[_coordValueCount++]=containerY;
        _containerCoordWriteList[_coordValueCount++]=containerZ;
        _taskStage=2;
        remainingBudget--;
        if(remainingBudget<=0){return !1}
      }
      _api.setStandardChestItemSlot(_registryPosition,_registrySlotIndex,_CHEST_ITEM_NAME,_null,_undefined,_registryItemPayload);
      _log(_LOG_PREFIX+"Storage build completed using registry at ("+_registryPosition[0]+", "+_registryPosition[1]+", "+_registryPosition[2]+").",2);
      _containerItemPayload.customAttributes._=_null;
      _containerCoordWriteList.length=0;
      _textSegments.length=0;
      _loadedChunkSet=_undefined;
      _registryPosition=_undefined;
      _containerPosition=_undefined;
      _taskStage=1;
      return !0
    };
    const _disposeStorage=(registryPosition,containerBudgetPerTick)=>{
      if(_taskStage===1){
        let registryMetadata=_readRegistryMetadata(registryPosition);
        if(registryMetadata===!1){return !1}
        if(registryMetadata===_null){return !0}
        _loadedChunkSet=_createObject(_null);
        _registryPosition=registryMetadata[0];
        _registryItems=_api.getStandardChestItems(_registryPosition);
        _registrySlotIndex=1;
        _coordOffset=0;
        _taskStage=2
      }
      let remainingBudget=containerBudgetPerTick,
      registrySlotItem,containerX,containerY,containerZ,chunkId;
      while(registrySlotItem=_registryItems[_registrySlotIndex]){
        if(_taskStage===2){
          _containerCoordReadList=registrySlotItem.attributes.customAttributes._;
          _coordOffset=0;
          _coordValueCount=_containerCoordReadList.length;
          _taskStage=3
        }
        if(_taskStage===3){
          while(_coordOffset+2<_coordValueCount){
            containerX=_containerCoordReadList[_coordOffset];
            containerY=_containerCoordReadList[_coordOffset+1];
            containerZ=_containerCoordReadList[_coordOffset+2];
            chunkId=(containerX>>5)+"|"+(containerY>>5)+"|"+(containerZ>>5);
            if(!(chunkId in _loadedChunkSet)){
              if(_api.getBlockId(containerX,containerY,containerZ)===1){return !1}
              _loadedChunkSet[chunkId]=1
            }
            _api.setBlock(containerX,containerY,containerZ,"Air");
            _coordOffset+=3;
            remainingBudget--;
            if(remainingBudget<=0){return !1}
          }
          _api.setStandardChestItemSlot(_registryPosition,_registrySlotIndex,"Air");
          _registrySlotIndex++;
          _taskStage=2
        }
      }
      _log(_LOG_PREFIX+"Storage disposal completed using registry at ("+_registryPosition[0]+", "+_registryPosition[1]+", "+_registryPosition[2]+").",2);
      _loadedChunkSet=_undefined;
      _registryPosition=_undefined;
      _registryItems=_undefined;
      _containerCoordReadList=_undefined;
      _taskStage=1;
      return !0
    };
    _CL_.SM={
      create:(minPosition,maxPosition)=>{
        _taskQueue[_taskQueue.length]=()=>_createRegistry(minPosition,maxPosition)
      },
      inspect:registryPosition=>{
        _taskQueue[_taskQueue.length]=()=>_inspectRegistry(registryPosition)
      },
      build:(registryPosition,sourceBlockList,containerBudgetPerTick=8)=>{
        _taskQueue[_taskQueue.length]=()=>_buildStorage(registryPosition,sourceBlockList,containerBudgetPerTick)
      },
      dispose:(registryPosition,containerBudgetPerTick=32)=>{
        _taskQueue[_taskQueue.length]=()=>_disposeStorage(registryPosition,containerBudgetPerTick)
      },
      _tick:()=>{
        let queueLength=_taskQueue.length;
        if(!queueLength){return}
        while(_taskIndex<queueLength){
          try{
            if(!_taskQueue[_taskIndex]()){break}
          }catch(error){
            _taskStage=1;
            _containerItemPayload.customAttributes._=_null;
            _containerCoordWriteList.length=0;
            _textSegments.length=0;
            _loadedChunkSet=_undefined;
            _registryPosition=_undefined;
            _containerPosition=_undefined;
            _registryItems=_undefined;
            _containerCoordReadList=_undefined;
            _log(_LOG_PREFIX+"Queued task failed: "+error.name+": "+error.message,0)
          }
          _taskIndex++
        }
        if(_taskIndex>=queueLength){
          _taskQueue.length=0;
          _taskIndex=0
        }
      }
    }
  }
  if(!!config?.enable_storage_manager){
    _globalThis.tick=function(){
      _activeTickHandler(50);
      _CL_.SM?._tick()
    }
  }else{
    _globalThis.tick=function(){
      _activeTickHandler(50)
    }
  }
  try{
    _CL_.startTime=Date.now();
    let logStylePresets=[
      "#FF775E","500","0.95rem",
      "#FFC23D","500","0.95rem",
      "#20DD69","500","0.95rem",
      "#52B2FF","500","0.95rem",
      "#B06CFF","500","0.95rem"
    ],
    logPayloads=_log.payloads=[];
    for(let type=0;type<=4;type++){
      logPayloads[type]=[{
        str:"",
        style:{
          color:logStylePresets[type*3],
          fontWeight:logStylePresets[type*3+1],
          fontSize:logStylePresets[type*3+2]
        }
      }]
    }
    _installEventBindings();
    Object.seal(_IF_);
    _globalThis.IF=_IF_;
    _globalThis.CL=_CL_;
    _initialGlobalKeysList=Reflect.ownKeys(_globalThis);
    config=_undefined;
    _installEventBindings=_undefined;
    _shutdownTick=_undefined;
    _CL_.stage=-3;
    _userTickHandler=_primaryTick;
    _activeTickHandler=_dispatchTick
  }catch(error){
    const startupErrorMessage="CL [Startup Error]: "+error.name+": "+error.message+".";
    _log(startupErrorMessage,0);
    if(!!config?.shutdown_on_startup_error){
      _activeTickHandler=()=>_shutdownTick(startupErrorMessage)
    }
  }
  void 0
}

