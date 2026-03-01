// Code Loader v2026-02-29-0001
// Interruption Framework v2026-02-29-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

const configuration = {
  EVENTS: [
    /* ... */
  ],
  BLOCKS: [
    /* ... */
  ],
  OM: {
    boot_delay_ms: 100,
    show_boot_status: true,
    show_errors: true,
    show_execution_info: false,
  },
  BM: {
    is_chest_mode: false,
    execution_budget_per_tick: 8,
    max_error_count: 32,
  },
  JM: {
    reset_on_reboot: true,
    dequeue_budget_per_tick: 8,
  },
  STYLES: [
    "#FF775E", "500", "0.95rem",
    "#FFC23D", "500", "0.95rem",
    "#20DD69", "500", "0.95rem",
    "#52B2FF", "500", "0.95rem",
  ],
};

{
  const _CF_=configuration,
  _IF_={
    en:0,
    fn:null,
    args:null,
    rcnt:0,
    sid:0,
    noArgs:null,
    tick:null
  },
  _SM_={
    create:null,
    check:null,
    build:null,
    dispose:null
  },
  _CL_={
    SM:null,
    config:null,
    isPrimaryBoot:!0,
    isRunning:!1,
    cursor:0,
    reboot:null,
    logBootStatus:null,
    logErrors:null,
    logExecutionInfo:null,
    logReport:null
  },
  _eval=eval,
  _floor=Math.floor,
  _getBlockId=api.getBlockId,
  _getBlockData=api.getBlockData,
  _getStandardChestItems=api.getStandardChestItems,
  _NO_OP=Object.freeze(function(){}),
  _LOG_STYLES=[],
  _LOG_PREFIX="Code Loader";
  const _log=(message,type)=>{
    let styledText=_LOG_STYLES[type];
    styledText[0].str=message;
    api.broadcastMessage(styledText);
    styledText[0].str=""
  },
  _establish=()=>{
    let JM_config=_CF_.JM,
    BM_config=_CF_.BM,
    OM_config=_CF_.OM;
    _EM_resetCursor=0;
    _TM_boot=_NO_OP;
    _TM_main=_NO_OP;
    if(_EM_join_handler){
      _JM_resetOnReboot=!!JM_config.reset_on_reboot;
      _JM_dequeueBudgetPerTick=JM_config.dequeue_budget_per_tick|0;
      _JM_dequeueBudgetPerTick=(_JM_dequeueBudgetPerTick&~(_JM_dequeueBudgetPerTick>>31))+(-_JM_dequeueBudgetPerTick>>31)+1;
      _JM_main=_NO_OP;
      if(!_OM_isPrimaryBoot){
        _JM_queue.length=0;
        if(_JM_resetOnReboot){
          _JM_playerStatus={}
        }
      }
      _JM_queueCursor=0
    }
    _BM_blockList=_CF_.BLOCKS instanceof Array?_CF_.BLOCKS:[];
    _BM_isChestMode=!!BM_config.is_chest_mode;
    _BM_executionBudgetPerTick=BM_config.execution_budget_per_tick|0;
    _BM_executionBudgetPerTick=(_BM_executionBudgetPerTick&~(_BM_executionBudgetPerTick>>31))+(-_BM_executionBudgetPerTick>>31)+1;
    _BM_errorLimit=BM_config.max_error_count|0;
    _BM_errorLimit=_BM_errorLimit&~(_BM_errorLimit>>31);
    _BM_errorList.length=1;
    _BM_errorList[0]=null;
    _BM_errorIndex=0;
    _BM_blockCursor=0;
    _BM_blockCount=_BM_blockList.length;
    if(_BM_isChestMode){
      _BM_isRegistryLoaded=!1;
      _BM_loadedChunks={};
      _BM_registrySlotIndex=1;
      _BM_coordIndex=0;
      _BM_partition=0
    }
    _OM_bootDelayTicks=(OM_config.boot_delay_ms|0)*.02|0;
    _OM_bootDelayTicks=_OM_bootDelayTicks&~(_OM_bootDelayTicks>>31);
    _OM_showBootStatus=!!OM_config.show_boot_status;
    _OM_showErrors=!!OM_config.show_errors;
    _OM_showExecutionInfo=!!OM_config.show_execution_info;
    _OM_loadDurationTicks=-1
  };
  {
    const _IF=_IF_,
    _NO_OP=_IF.fn=Object.freeze(()=>{}),
    _NO_ARGS=_IF.args=_IF.noArgs=Object.freeze([]),
    _NO_TASK=[null,_NO_ARGS,null,0],
    _queue=[];
    let _task=_NO_TASK,
    _external=1,
    _headIndex=0,
    _tailIndex=0,
    _queueSize=0;
    _IF.tick=()=>{
      _IF.fn=_NO_OP;
      _IF.args=_NO_ARGS;
      if(!_queueSize){return}
      _external=0;
      let _error=null;
      while(_queueSize){
        _task=_queue[_headIndex];
        _IF.args=_task[1];
        _IF.rcnt=++_task[2];
        _IF.sid=_task[3];
        try{
          _task[0](..._IF.args)
        }catch(error){
          _error=error
        }
        _queue[_headIndex]=void 0;
        _headIndex++;
        _queueSize--;
        if(_error){
          _log("Interruption Framework ["+(_task[0]?.name||"<anonymous>")+"]: "+_error.name+": "+_error.message,0);
          _error=null
        }
      }
      _headIndex=0;
      _tailIndex=0;
      _queue.length=0;
      _task=_NO_TASK;
      _IF.en=0;
      _IF.fn=_NO_OP;
      _IF.args=_NO_ARGS;
      _IF.rcnt=0;
      _external=1
    };
    Object.defineProperty(globalThis.InternalError.prototype,"name",{
      configurable:!0,
      get:()=>{
        if(_external){
          if(_IF.en){
            _IF.en=0;
            _queue[_tailIndex]=[_IF.fn,_IF.args,0,_IF.sid];
            _tailIndex++;
            _queueSize++
          }
        }else{
          _IF.en=0;
          _IF.rcnt=0;
          _task[1]=_IF.args;
          _task[3]=_IF.sid;
          _task=_NO_TASK;
          _IF.args=_NO_ARGS;
          _external=1
        }
        return"InternalError"
      }
    })
  }
  let _SM_queue,
  _SM_tick;
  {
    let _setBlock=api.setBlock,
    _getStandardChestItemSlot=api.getStandardChestItemSlot,
    _setStandardChestItemSlot=api.setStandardChestItemSlot,
    _prefix=_LOG_PREFIX+" SM: ",
    _queue=_SM_queue=[],
    _queueCursor=0,
    _taskState=1,
    _blockType="Bedrock",
    _itemType="Boat",
    _storageSlotData={customAttributes:{_:null}},
    _registrySlotData={customAttributes:{_:[]}},
    _coordWriteBuffer=_registrySlotData.customAttributes._,
    _textSegmentsBuffer=[],
    _loadedChunks,
    _registryChestPos,
    _storageChestPos,
    _registryItems,
    _registrySlotIndex,
    _lowX,
    _lowY,
    _lowZ,
    _highX,
    _highY,
    _highZ,
    _storageX,
    _storageY,
    _storageZ,
    _blockCursor,
    _partition,
    _coordReadList,
    _coordIndex,
    _coordValueCount;
    const _readRegistryInfo=registryPos=>{
      if(!registryPos?.length||registryPos.length<3){
        _log(_prefix+"Invalid registry position. Expected registryPos as [x, y, z].",1);
        return null
      }
      let rx=_floor(registryPos[0])|0,
      ry=_floor(registryPos[1])|0,
      rz=_floor(registryPos[2])|0;
      if(_getBlockId(rx,ry,rz)===1){return !1}
      let registryChestPos=[rx,ry,rz],
      region=_getStandardChestItemSlot(registryChestPos,0)?.attributes?.customAttributes?.region;
      if(!region){
        _log(_prefix+"No valid registry unit found at ("+rx+", "+ry+", "+rz+").",1);
        return null
      }
      return[registryChestPos,region]
    },
    _create_task=(lowPos,highPos)=>{
      if(!lowPos?.length||!highPos?.length||lowPos.length<3||highPos.length<3){
        _log(_prefix+"Invalid region positions. Expected lowPos and highPos as [x, y, z].",1);
        return !0
      }
      let lowX=_floor(lowPos[0])|0,
      lowY=_floor(lowPos[1])|0,
      lowZ=_floor(lowPos[2])|0,
      highX=_floor(highPos[0])|0,
      highY=_floor(highPos[1])|0,
      highZ=_floor(highPos[2])|0;
      if(lowX>highX||lowY>highY||lowZ>highZ){
        _log(_prefix+"Invalid region bounds. lowPos ["+lowX+", "+lowY+", "+lowZ+"] must be <= highPos ["+highX+", "+highY+", "+highZ+"] on all axes.",1);
        return !0
      }
      if(_getBlockId(lowX,lowY,lowZ)===1){return !1}
      _setBlock(lowX,lowY,lowZ,_blockType);
      _setStandardChestItemSlot([lowX,lowY,lowZ],0,_itemType,null,void 0,{
        customAttributes:{
          region:[lowX,lowY,lowZ,highX,highY,highZ]
        }
      });
      _log(_prefix+"Registry unit created at ("+lowX+", "+lowY+", "+lowZ+").",2);
      return !0
    },
    _check_task=registryPos=>{
      let registryInfo=_readRegistryInfo(registryPos);
      if(registryInfo===!1){return !1}
      if(registryInfo===null){return !0}
      let region=registryInfo[1];
      _log(_prefix+"Storage covers region from ("+region[0]+","+region[1]+","+region[2]+") to ("+region[3]+","+region[4]+","+region[5]+").",3);
      return !0
    },
    _build_task=(registryPos,blockList,maxStorageUnitsPerTick)=>{
      if(_taskState===1){
        let registryInfo=_readRegistryInfo(registryPos);
        if(registryInfo===!1){return !1}
        if(registryInfo===null){return !0}
        let region=registryInfo[1];
        _lowX=region[0];
        _lowY=region[1];
        _lowZ=region[2];
        _highX=region[3];
        _highY=region[4];
        _highZ=region[5];
        let capacity=(_highX-_lowX+1)*(_highY-_lowY+1)*(_highZ-_lowZ+1)-1,
        required=blockList.length+3>>2;
        if(capacity<required){
          _log(_prefix+"Not enough space. Need "+required+" storage units, but region holds "+capacity+".",0);
          return !0
        }
        _registryChestPos=registryInfo[0];
        _loadedChunks={};
        _storageX=_lowX;
        _storageY=_lowY;
        _storageZ=_lowZ;
        _blockCursor=0;
        _registrySlotIndex=1;
        _coordValueCount=0;
        _taskState=2
      }
      let sx=_storageX,
      sy=_storageY,
      sz=_storageZ,
      budget=maxStorageUnitsPerTick,
      blockCount=blockList.length,
      rawText,rawStart,rawEnd,escapedText,escapedCursor,escapedTextEnd,escapedSegmentEnd,backslashPosition,runLength,
      block,bx,by,bz,chunkId,storageSlotBaseIndex,segmentIndex,segmentCount;
      while(_blockCursor<blockCount){
        if(_taskState===2){
          sx++;
          if(sx>_highX){
            sx=_lowX;
            sz++;
            if(sz>_highZ){
              sz=_lowZ;
              sy++;
              if(sy>_highY){
                return !0
              }
            }
          }
          chunkId=(sx>>5)+"|"+(sy>>5)+"|"+(sz>>5);
          if(!_loadedChunks[chunkId]){
            if(_getBlockId(sx,sy,sz)===1){return !1}
            _loadedChunks[chunkId]=!0
          }
          _setBlock(sx,sy,sz,_blockType);
          _storageX=sx;
          _storageY=sy;
          _storageZ=sz;
          _storageChestPos=[sx,sy,sz];
          _partition=0;
          _taskState=3
        }
        while(_partition<4&&_blockCursor<blockCount){
          if(_taskState===3){
            block=blockList[_blockCursor];
            if(!block?.length||block.length<3){
              _blockCursor++;
              continue
            }
            bx=_floor(block[0])|0;
            by=_floor(block[1])|0;
            bz=_floor(block[2])|0;
            chunkId=(bx>>5)+"|"+(by>>5)+"|"+(bz>>5);
            if(!_loadedChunks[chunkId]){
              if(_getBlockId(bx,by,bz)===1){return !1}
              _loadedChunks[chunkId]=!0
            }
            rawText=_getBlockData(bx,by,bz)?.persisted?.shared?.text;
            if(rawText?.length>0){
              segmentIndex=0;
              rawStart=0;
              rawEnd=0;
              escapedText=JSON.stringify(rawText);
              escapedCursor=1;
              escapedTextEnd=escapedText.length-1;
              while(escapedCursor<escapedTextEnd){
                escapedSegmentEnd=escapedCursor+1950;
                if(escapedSegmentEnd>escapedTextEnd){escapedSegmentEnd=escapedTextEnd}
                escapedSegmentEnd-=escapedText[escapedSegmentEnd-1]==="\\";
                while(escapedCursor<escapedSegmentEnd){
                  backslashPosition=escapedText.indexOf("\\",escapedCursor);
                  if(backslashPosition===-1||backslashPosition>=escapedSegmentEnd){
                    runLength=escapedSegmentEnd-escapedCursor;
                    escapedCursor+=runLength;
                    rawEnd+=runLength;
                    break
                  }
                  if(backslashPosition>escapedCursor){
                    runLength=backslashPosition-escapedCursor;
                    escapedCursor+=runLength;
                    rawEnd+=runLength
                  }
                  escapedCursor+=2;
                  rawEnd+=1
                }
                _textSegmentsBuffer[segmentIndex]=rawText.slice(rawStart,rawEnd);
                segmentIndex++;
                rawStart=rawEnd
              }
              _textSegmentsBuffer.length=segmentIndex;
              _taskState=4
            }
          }
          if(_taskState===4){
            storageSlotBaseIndex=_partition*9;
            segmentIndex=0;
            segmentCount=_textSegmentsBuffer.length;
            while(segmentIndex<segmentCount){
              _storageSlotData.customAttributes._=_textSegmentsBuffer[segmentIndex];
              _setStandardChestItemSlot(_storageChestPos,storageSlotBaseIndex+segmentIndex,_itemType,null,void 0,_storageSlotData);
              segmentIndex++
            }
            _partition++;
            _taskState=3
          }
          _blockCursor++
        }
        if(_coordValueCount>=243){
          _setStandardChestItemSlot(_registryChestPos,_registrySlotIndex,_itemType,null,void 0,_registrySlotData);
          _coordWriteBuffer.length=0;
          _coordValueCount=0;
          _registrySlotIndex++
        }
        _coordWriteBuffer[_coordValueCount++]=sx;
        _coordWriteBuffer[_coordValueCount++]=sy;
        _coordWriteBuffer[_coordValueCount++]=sz;
        _taskState=2;
        budget--;
        if(budget<=0){return !1}
      }
      _setStandardChestItemSlot(_registryChestPos,_registrySlotIndex,_itemType,null,void 0,_registrySlotData);
      _log(_prefix+"Built storage at ("+_registryChestPos[0]+", "+_registryChestPos[1]+", "+_registryChestPos[2]+").",2);
      _storageSlotData.customAttributes._=null;
      _coordWriteBuffer.length=0;
      _textSegmentsBuffer.length=0;
      _loadedChunks=null;
      _registryChestPos=null;
      _storageChestPos=null;
      _taskState=1;
      return !0
    },
    _dispose_task=(registryPos,maxStorageUnitsPerTick)=>{
      if(_taskState===1){
        let registryInfo=_readRegistryInfo(registryPos);
        if(registryInfo===!1){return !1}
        if(registryInfo===null){return !0}
        _registryChestPos=registryInfo[0];
        _loadedChunks={};
        _registryItems=_getStandardChestItems(_registryChestPos);
        _registrySlotIndex=1;
        _coordIndex=0;
        _taskState=2
      }
      let budget=maxStorageUnitsPerTick,
      registryItem,sx,sy,sz,chunkId;
      while(registryItem=_registryItems[_registrySlotIndex]){
        if(_taskState===2){
          _coordReadList=registryItem.attributes.customAttributes._;
          _coordIndex=0;
          _coordValueCount=_coordReadList.length;
          _taskState=3
        }
        if(_taskState===3){
          while(_coordIndex<_coordValueCount){
            sx=_coordReadList[_coordIndex];
            sy=_coordReadList[_coordIndex+1];
            sz=_coordReadList[_coordIndex+2];
            chunkId=(sx>>5)+"|"+(sy>>5)+"|"+(sz>>5);
            if(!_loadedChunks[chunkId]){
              if(_getBlockId(sx,sy,sz)===1){return !1}
              _loadedChunks[chunkId]=!0
            }
            _setBlock(sx,sy,sz,"Air");
            _coordIndex+=3;
            budget--;
            if(budget<=0){
              return !1
            }
          }
          _setStandardChestItemSlot(_registryChestPos,_registrySlotIndex,"Air");
          _registrySlotIndex++;
          _taskState=2
        }
      }
      _log(_prefix+"Disposed storage at ("+_registryChestPos[0]+", "+_registryChestPos[1]+", "+_registryChestPos[2]+").",2);
      _loadedChunks=null;
      _registryChestPos=null;
      _registryItems=null;
      _coordReadList=null;
      _taskState=1;
      return !0
    };
    _SM_.create=(lowPosition,highPosition)=>{
      _queue[_queue.length]=()=>_create_task(lowPosition,highPosition)
    };
    _SM_.check=registryPosition=>{
      _queue[_queue.length]=()=>_check_task(registryPosition)
    };
    _SM_.build=(registryPosition,blockList,maxStorageUnitsPerTick=8)=>{
      _queue[_queue.length]=()=>_build_task(registryPosition,blockList,maxStorageUnitsPerTick)
    };
    _SM_.dispose=(registryPosition,maxStorageUnitsPerTick=32)=>{
      _queue[_queue.length]=()=>_dispose_task(registryPosition,maxStorageUnitsPerTick)
    };
    _SM_tick=()=>{
      let isQueueActive=_queueCursor<_queue.length;
      while(isQueueActive){
        try{
          if(!_queue[_queueCursor]()){break}
        }catch(error){
          _taskState=1;
          _log(_prefix+"Task error on tick - "+error.name+": "+error.message,0)
        }
        isQueueActive=++_queueCursor<_queue.length
      }
      if(!isQueueActive){
        _queue.length=0;
        _queueCursor=0
      }
    }
  }
  let _EM_setterByName=Object.create(null),
  _EM_getterByName=Object.create(null),
  _EM_isSetupComplete=!1,
  _EM_setupError=null,
  _EM_eventNames=[],
  _EM_eventFallbacks=[],
  _EM_installCursor=0,
  _EM_join_handler,
  _EM_tick_handler,
  _EM_resetCursor;
  const _EM_setup=()=>{
    if(_EM_isSetupComplete){return}
    let eventList=_CF_.EVENTS,
    eventCount=eventList.length,
    index=0,
    entry;
    while(index<eventCount){
      entry=eventList[index];
      let eventName,captureInterrupts,fallbackValue;
      if(typeof entry==="string"){
        eventName=entry
      }else{
        eventName=entry[0];
        captureInterrupts=!!entry[1];
        fallbackValue=entry[2]
      }
      if(eventName==="tick"){
        index++;
        continue
      }
      if(eventName!=="onPlayerJoin"){
        _EM_eventNames[_EM_eventNames.length]=eventName;
        _EM_eventFallbacks[_EM_eventFallbacks.length]=fallbackValue;
        let handler=_NO_OP;
        _EM_setterByName[eventName]=fn=>{handler=typeof fn==="function"?fn:_NO_OP};
        _EM_getterByName[eventName]=()=>handler;
        if(captureInterrupts){
          const _IF=_IF_;
          globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
            _IF.en=1;
            _IF.fn=handler;
            _IF.args=[arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8];
            _IF.sid=0;
            try{
              return handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
            }finally{
              _IF.en=0
            }
          }
        }else{
          globalThis[eventName]=function(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8){
            return handler(arg0,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8)
          }
        }
      }else{
        _EM_join_handler=_JM_dispatch;
        _EM_setterByName.onPlayerJoin=fn=>{_EM_join_handler=typeof fn==="function"?fn:_NO_OP};
        _EM_getterByName.onPlayerJoin=()=>_EM_join_handler;
        if(captureInterrupts){
          const _IF=_IF_;
          globalThis.onPlayerJoin=function(arg0,arg1){
            _IF.en=1;
            _IF.fn=_EM_join_handler;
            _IF.args=[arg0,arg1];
            _IF.sid=0;
            try{
              return _EM_join_handler(arg0,arg1)
            }finally{
              _IF.en=0
            }
          }
        }else{
          globalThis[eventName]=function(arg0,arg1){
            return _EM_join_handler(arg0,arg1)
          }
        }
      }
      index++
    }
    _EM_setterByName.tick=fn=>{_EM_tick_handler=typeof fn==="function"?fn:_NO_OP};
    _EM_getterByName.tick=()=>_EM_tick_handler
  },
  _EM_install=()=>{
    let eventCount=_EM_eventNames.length;
    while(_EM_installCursor<eventCount){
      let eventName=_EM_eventNames[_EM_installCursor],
      fallbackValue=_EM_eventFallbacks[_EM_installCursor];
      if(fallbackValue!==void 0){
        api.setCallbackValueFallback(eventName,fallbackValue)
      }
      Object.defineProperty(globalThis,eventName,{
        configurable:!0,
        set:_EM_setterByName[eventName],
        get:_EM_getterByName[eventName]
      });
      _EM_installCursor++
    }
    if(_EM_join_handler){
      Object.defineProperty(globalThis,"onPlayerJoin",{
        configurable:!0,
        set:_EM_setterByName.onPlayerJoin,
        get:_EM_getterByName.onPlayerJoin
      })
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:_EM_setterByName.tick,
      get:_EM_getterByName.tick
    });
    _EM_eventFallbacks=null
  },
  _EM_reset=()=>{
    let eventCount=_EM_eventNames.length;
    while(_EM_resetCursor<eventCount){
      _EM_setterByName[_EM_eventNames[_EM_resetCursor]](_NO_OP);
      _EM_resetCursor++
    }
    if(_EM_join_handler){_EM_join_handler=_NO_OP}
  };
  let _TM_boot,
  _TM_main;
  const _TM_dispatch=()=>{
    _IF_.tick();
    _TM_main(50);
    _TM_boot()
  },
  _TM_install=()=>{
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:fn=>{_TM_main=typeof fn==="function"?fn:_NO_OP},
      get:()=>_TM_main
    });
    _TM_boot=_EM_tick_handler;
    _EM_tick_handler=_TM_dispatch
  },
  _TM_finalize=()=>{
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:_EM_setterByName.tick,
      get:_EM_getterByName.tick
    });
    _EM_tick_handler=_TM_main;
    _TM_boot=_NO_OP
  };
  let _JM_resetOnReboot,
  _JM_dequeueBudgetPerTick,
  _JM_main,
  _JM_queue=[],
  _JM_playerStatus={},
  _JM_queueCursor;
  const _JM_dispatch=(playerId,fromGameReset)=>{
    let index=_JM_queue.length;
    _JM_queue[index]=playerId;
    _JM_queue[index+1]=fromGameReset;
    _JM_playerStatus[playerId]=1
  },
  _JM_install=()=>{
    _EM_join_handler=_JM_dispatch;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:fn=>{_JM_main=typeof fn==="function"?fn:_NO_OP},
      get:()=>_JM_main
    })
  },
  _JM_scan=()=>{
    if(_JM_resetOnReboot||_OM_isPrimaryBoot){
      let playerIds=api.getPlayerIds(),
      cursor=0,
      playerId,queueIndex;
      while(playerId=playerIds[cursor]){
        if(!_JM_playerStatus[playerId]){
          queueIndex=_JM_queue.length;
          _JM_queue[queueIndex]=playerId;
          _JM_queue[queueIndex+1]=!1;
          _JM_playerStatus[playerId]=1
        }
        cursor++
      }
    }
  },
  _JM_processQueue=()=>{
    let budget=_JM_dequeueBudgetPerTick,
    playerId,fromGameReset;
    while(_JM_queueCursor<_JM_queue.length&&budget>0){
      playerId=_JM_queue[_JM_queueCursor];
      if(_JM_playerStatus[playerId]!==2){
        fromGameReset=_JM_queue[_JM_queueCursor+1];
        _JM_playerStatus[playerId]=2;
        _JM_queueCursor+=2;
        _IF_.en=1;
        _IF_.fn=_JM_main;
        _IF_.args=[playerId,fromGameReset];
        _IF_.sid=0;
        try{
          _JM_main(playerId,fromGameReset)
        }catch(error){
          _IF_.en=0;
          _log(_LOG_PREFIX+" JM: "+error.name+": "+error.message,0)
        }
        _IF_.en=0;
        _JM_queueCursor-=2;
        budget--
      }
      _JM_queueCursor+=2
    }
    return _JM_queueCursor>=_JM_queue.length
  },
  _JM_finalize=()=>{
    _EM_join_handler=_JM_main;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:_EM_setterByName.onPlayerJoin,
      get:_EM_getterByName.onPlayerJoin
    });
    _JM_queue.length=0
  };
  let _BM_prefix=_LOG_PREFIX+" BM: ",
  _BM_executor,
  _BM_blockList,
  _BM_errorList=[null],
  _BM_isChestMode,
  _BM_executionBudgetPerTick,
  _BM_errorLimit,
  _BM_errorIndex,
  _BM_blockCursor,
  _BM_blockCount,
  _BM_isRegistryLoaded,
  _BM_loadedChunks,
  _BM_registryItems,
  _BM_storageItems,
  _BM_registrySlotIndex,
  _BM_coordIndex,
  _BM_partition;
  const _BM_blockExecutor=()=>{
    let budget=_BM_executionBudgetPerTick,
    block,bx,by,bz,code;
    while(_BM_blockCursor<_BM_blockCount){
      block=_BM_blockList[_BM_blockCursor];
      if(!block?.length||block.length<3){
        _CL_.cursor=++_BM_blockCursor;
        continue
      }
      bx=block[0]=_floor(block[0])|0;
      by=block[1]=_floor(block[1])|0;
      bz=block[2]=_floor(block[2])|0;
      if((block[3]=api.getBlock(bx,by,bz))==="Unloaded"){return !1}
      try{
        code=_getBlockData(bx,by,bz)?.persisted?.shared?.text;
        _eval(code)
      }catch(error){
        _BM_errorList[++_BM_errorIndex*+(_BM_errorList.length-1<_BM_errorLimit)]=[error.name,error.message,bx,by,bz]
      }
      _CL_.cursor=++_BM_blockCursor;
      budget--;
      if(budget<=0){return !1}
    }
    return !0
  },
  _BM_storageExecutor=()=>{
    if(!_BM_isRegistryLoaded){
      let registryPos=_BM_blockList[0];
      if(!registryPos?.length||registryPos.length<3){return !0}
      let rx=registryPos[0]=_floor(registryPos[0])|0,
      ry=registryPos[1]=_floor(registryPos[1])|0,
      rz=registryPos[2]=_floor(registryPos[2])|0;
      if(_getBlockId(rx,ry,rz)===1){return !1}
      _BM_registryItems=_getStandardChestItems([rx,ry,rz]);
      if(!_BM_registryItems[0]?.attributes?.customAttributes?.region){return !0}
      _BM_isRegistryLoaded=!0
    }
    let budget=_BM_executionBudgetPerTick,
    registryItem,coordList,coordCount,sx,sy,sz,chunkId,code,storageSlotBaseIndex,segmentIndex,storageItem;
    while(registryItem=_BM_registryItems[_BM_registrySlotIndex]){
      coordList=registryItem.attributes.customAttributes._;
      coordCount=coordList.length-2;
      while(_BM_coordIndex<coordCount){
        sx=coordList[_BM_coordIndex];
        sy=coordList[_BM_coordIndex+1];
        sz=coordList[_BM_coordIndex+2];
        chunkId=(sx>>5)+"|"+(sy>>5)+"|"+(sz>>5);
        if(!_BM_loadedChunks[chunkId]){
          if(_getBlockId(sx,sy,sz)===1){return !1}
          _BM_loadedChunks[chunkId]=!0
        }
        if(_BM_partition===0){
          _BM_storageItems=_getStandardChestItems([sx,sy,sz])
        }
        while(_BM_partition<4){
          code="";storageSlotBaseIndex=_BM_partition*9;
          segmentIndex=0;
          while(segmentIndex<9&&(storageItem=_BM_storageItems[storageSlotBaseIndex+segmentIndex])){
            code+=storageItem.attributes.customAttributes._;
            segmentIndex++
          }
          if(segmentIndex===0){
            _CL_.cursor++;
            break
          }
          try{
            _eval(code)
          }catch(error){
            _BM_errorList[++_BM_errorIndex*+(_BM_errorList.length-1<_BM_errorLimit)]=[error.name,error.message,sx,sy,sz,_BM_partition]
          }
          _BM_partition++;
          _CL_.cursor++;
          budget--;
          if(budget<=0){
            return !1
          }
        }
        _BM_partition=0;
        _BM_coordIndex+=3
      }
      _BM_coordIndex=0;
      _BM_registrySlotIndex++
    }
    return !0
  },
  _BM_install=()=>{
    _BM_executor=_BM_isChestMode?_BM_storageExecutor:_BM_blockExecutor
  },
  _BM_finalize=()=>{
    _BM_errorList[0]=null;
    _BM_loadedChunks=null;
    _BM_registryItems=null;
    _BM_storageItems=null
  };
  let _OM_prefix=_LOG_PREFIX+" OM: ",
  _OM_bootState=-2,
  _OM_isPrimaryBoot=!0,
  _OM_tickCount=-1,
  _OM_isRunning=!1,
  _OM_bootDelayTicks,
  _OM_showBootStatus,
  _OM_showErrors,
  _OM_showExecutionInfo,
  _OM_loadDurationTicks;
  const _OM_logBootStatus=showErrorCount=>{
    let message="Code was loaded in "+_OM_loadDurationTicks*50+" ms",
    errorCount=_BM_errorList.length-1;
    if(showErrorCount){
      message+=errorCount>0?" with "+errorCount+" error"+(errorCount===1?"":"s")+".":" with 0 errors."
    }else{
      message+="."
    }
    _log(_OM_prefix+message,1+(errorCount<=0))
  },
  _OM_logErrors=showSuccess=>{
    let errorCount=_BM_errorList.length-1;
    if(errorCount>0){
      let message="Code execution error"+(errorCount===1?"":"s")+":",
      error;
      if(_BM_isChestMode){
        for(let index=1;index<=errorCount;index++){
          error=_BM_errorList[index];
          message+="\n"+error[0]+" at ("+error[2]+", "+error[3]+", "+error[4]+") in partition ("+error[5]+"): "+error[1]
        }
      }else{
        for(let index=1;index<=errorCount;index++){
          error=_BM_errorList[index];
          message+="\n"+error[0]+" at ("+error[2]+", "+error[3]+", "+error[4]+"): "+error[1]
        }
      }
      _log(_BM_prefix+message,0)
    }else if(showSuccess){
      _log(_BM_prefix+"No code execution errors.",2)
    }
  },
  _OM_logExecutionInfo=()=>{
    let message="",
    block;
    if(_BM_isChestMode){
      if(_BM_isRegistryLoaded){
        block=_BM_blockList[0];
        message="Executed storage data at ("+block[0]+", "+block[1]+", "+block[2]+")."
      }else{
        message="No storage data found."
      }
    }else{
      let amount=0,
      blockCount=_BM_blockList.length;
      for(let index=0;index<blockCount;index++){
        block=_BM_blockList[index];
        if(block?.[3]){
          message+='\n"'+block[3]+'" at ('+block[0]+", "+block[1]+", "+block[2]+")";
          amount++
        }
      }
      message="Executed "+amount+" block"+(amount===1?"":"s")+" data"+(amount===0?".":":")+message
    }
    _log(_BM_prefix+message,3)
  },
  _OM_logReport=(showBootStatus,showErrors,showExecutionInfo)=>{
    if(showBootStatus){
      _OM_logBootStatus(showErrors)
    }
    if(showErrors){
      _OM_logErrors(!showBootStatus)
    }
    if(showExecutionInfo){
      _OM_logExecutionInfo()
    }
  },
  _OM_tick=()=>{
    _OM_tickCount++;
    if(_OM_bootState<3){
      if(_OM_bootState===-2){
        if(!_EM_isSetupComplete&&_OM_tickCount>20){
          let message=_LOG_PREFIX+" EM: Error on primary setup - "+_EM_setupError?.[0]+": "+_EM_setupError?.[1]+".",
          playerIds=api.getPlayerIds(),
          cursor=0,
          playerId;
          while(playerId=playerIds[cursor]){
            if(api.checkValid(playerId)){
              api.kickPlayer(playerId,message)
            }
            cursor++
          }
        }
        return
      }
      if(_OM_bootState===0){
        _establish();
        _OM_bootState=1
      }
      if(_OM_bootState===1){
        if(_OM_tickCount<_OM_bootDelayTicks){return}
        _OM_bootState=2
      }
      if(_OM_bootState===2){
        if(_OM_isPrimaryBoot){
          _EM_install()
        }else{
          _EM_reset()
        }
        if(_EM_join_handler){
          _JM_install();
          _JM_scan()
        }
        _BM_install();
        _TM_install();
        _OM_bootState=3
      }
    }
    if(_OM_bootState===3&&_BM_executor()){
      _BM_finalize();
      _OM_bootState=4+!_EM_join_handler
    }
    if(_OM_bootState===4&&_JM_processQueue()){
      _JM_finalize();
      _OM_bootState=5
    }
    if(_OM_bootState===5){
      _TM_finalize();
      _CL_.isPrimaryBoot=_OM_isPrimaryBoot=!1;
      _CL_.isRunning=_OM_isRunning=!1;
      _OM_bootState=-1;
      _OM_loadDurationTicks=_OM_tickCount-_OM_bootDelayTicks+1;
      _OM_logReport(_OM_showBootStatus,_OM_showErrors,_OM_showExecutionInfo)
    }
  };
  _CL_.SM=_SM_;
  _CL_.config=_CF_;
  _CL_.reboot=()=>{
    if(!_OM_isRunning){
      _OM_tickCount=0;
      _CL_.isRunning=_OM_isRunning=!0;
      _CL_.cursor=0;
      _EM_tick_handler=_OM_tick;
      _OM_bootState=0
    }else{
      _log(_OM_prefix+"Reboot request was denied.",1)
    }
  };
  _CL_.logBootStatus=(showErrorCount=!0)=>{
    _OM_logBootStatus(showErrorCount)
  };
  _CL_.logErrors=(showSuccess=!0)=>{
    _OM_logErrors(showSuccess)
  };
  _CL_.logExecutionInfo=()=>{
    _OM_logExecutionInfo()
  };
  _CL_.logReport=(showBootStatus=!0,showErrors=!0,showExecutionInfo=!1)=>{
    _OM_logReport(showBootStatus,showErrors,showExecutionInfo)
  };
  _EM_tick_handler=_OM_tick;
  globalThis.tick=function(){
    _EM_tick_handler(50);
    if(_SM_queue.length){_SM_tick()}
  };
  try{
    _OM_tickCount=0;
    _CL_.isRunning=_OM_isRunning=!0;
    _CL_.cursor=0;
    _EM_setup();
    let styles=_CF_.STYLES;
    for(let type=0;type<4;type++){
      _LOG_STYLES[type]=[{
        str:"",
        style:{
          color:styles[type*3],
          fontWeight:styles[type*3+1],
          fontSize:styles[type*3+2]
        }
      }]
    }
    let seal=Object.seal,
    freeze=Object.freeze;
    seal(_CF_);
    seal(_CF_.OM);
    seal(_CF_.BM);
    seal(_CF_.JM);
    freeze(_CF_.STYLES);
    seal(_IF_);
    freeze(_SM_);
    seal(_CL_);
    _EM_isSetupComplete=!0;
    _OM_bootState=0
  }catch(error){
    _EM_setupError=[error.name,error.message]
  }
  globalThis.IF=_IF_;
  globalThis.CL=_CL_;
  void 0
}


/*

A - _CF_
B - _IF_
C - _SM_
D - _CL_
E -_eval
F - _floor
G - _getBlockId
H - _getBlockData
I - _getStandardChestItems
J - _NO_OP
K - _LOG_STYLES
L - _LOG_PREFIX
_A - _SM_queue
_B - _SM_tick
M - _EM_setterByName
N - _EM_getterByName
O - _EM_isSetupComplete
P - _EM_setupError
Q - _EM_eventNames
R - _EM_eventFallbacks
S - _EM_installCursor
T - _EM_join_handler
U - _EM_tick_handler
V - _EM_resetCursor
W - _TM_boot
X - _TM_main
Y - _JM_resetOnReboot
Z - _JM_dequeueBudgetPerTick
a - _JM_main
b - _JM_queue
c - _JM_playerStatus
d - _JM_queueCursor
e - _BM_prefix
f - _BM_blockList
g - _BM_errorList
h - _BM_isChestMode
i - _BM_executionBudgetPerTick
j - _BM_errorLimit
k - _BM_errorIndex
l - _BM_blockCursor
m - _BM_blockCount
n - _BM_isRegistryLoaded
o - _BM_loadedChunks
p - _BM_registryItems
q - _BM_storageItems
r - _BM_registrySlotIndex
s - _BM_coordIndex
t - _BM_partition
_C - _OM_prefix
u - _OM_bootState
v - _OM_isPrimaryBoot
w - _OM_tickCount
x - _OM_isRunning
y - _OM_bootDelayTicks
_D - _OM_showBootStatus
_E - _OM_showErrors
_F - _OM_showExecutionInfo
z - _OM_loadDurationTicks

*/

