const WebSocket = require('ws');

class Cortex {
    numberOfRecords = 0;
    isRecordToSave = 0;
    recordSaved = [];

    constructor (user, socketUrl) {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
        this.socket = new WebSocket(socketUrl)

        this.user = user
    }

    requestAccess(){
        let socket = this.socket
        let user = this.user
        return new Promise(function(resolve, reject){
            const REQUEST_ACCESS_ID = 1
            let requestAccessRequest = {
                "jsonrpc": "2.0", 
                "method": "requestAccess", 
                "params": { 
                    "clientId": user.clientId, 
                    "clientSecret": user.clientSecret
                },
                "id": REQUEST_ACCESS_ID
            }

            socket.send(JSON.stringify(requestAccessRequest));

            socket.on('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==REQUEST_ACCESS_ID){
                        resolve(data)
                    }
                } catch (error) {}
            })
        })
    }

    subRequest(stream, authToken, sessionId){
        let socket = this.socket
        const SUB_REQUEST_ID = 6 
        let subRequest = { 
            "jsonrpc": "2.0", 
            "method": "subscribe", 
            "params": { 
                "cortexToken": authToken,
                "session": sessionId,
                "streams": stream
            }, 
            "id": SUB_REQUEST_ID
        }
        socket.send(JSON.stringify(subRequest))
        socket.on('message', (data)=>{
            try {
            } catch (error) {}
        })
    }

    async checkGrantAccessAndQuerySessionInfo(){
        let requestAccessResult = ""
        await this.requestAccess().then((result)=>{requestAccessResult=result})

        let accessGranted = JSON.parse(requestAccessResult)
    
       
        if ("error" in accessGranted){
            throw new Error('You must login on CortexUI before request for grant access')
        }else{
            if(accessGranted['result']['accessGranted']){
                await this.querySessionInfo()
            }
            else{
                throw new Error('You must accept access request from this app on CortexUI')
            }
        }   
    }

    async querySessionInfo(){
        let headsetId=""
        await this.queryHeadsetId().then((headset)=>{headsetId = headset})
        this.headsetId = headsetId

        let ctResult=""
        await this.controlDevice(headsetId).then((result)=>{ctResult=result})
        this.ctResult = ctResult;

        let authToken=""
        await this.authorize().then((auth)=>{authToken = auth})
        this.authToken = authToken

        let sessionId = ""
        await this.createSession(authToken, headsetId).then((result)=>{sessionId=result})
        this.sessionId = sessionId;
    }

    queryHeadsetId(){
        const QUERY_HEADSET_ID = 2
        let socket = this.socket
        let queryHeadsetRequest =  {
            "jsonrpc": "2.0", 
            "id": QUERY_HEADSET_ID,
            "method": "queryHeadsets",
            "params": {}
        }

        return new Promise(function(resolve, reject){
            socket.send(JSON.stringify(queryHeadsetRequest));
            socket.on('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==QUERY_HEADSET_ID){
                        if(JSON.parse(data)['result'].length > 0){
                            let headsetId = JSON.parse(data)['result'][0]['id']
                            resolve(headsetId)
                        }
                        else{
                        }
                    }
                   
                } catch (error) {}
            })
        })
    }

    controlDevice(headsetId){
        let socket = this.socket
        const CONTROL_DEVICE_ID = 3
        let controlDeviceRequest = {
            "jsonrpc": "2.0",
            "id": CONTROL_DEVICE_ID,
            "method": "controlDevice",
            "params": {
                "command": "connect",
                "headset": headsetId
            }
        }
        return new Promise(function(resolve, reject){
            socket.send(JSON.stringify(controlDeviceRequest));
            socket.on('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==CONTROL_DEVICE_ID){
                        resolve(data)
                    }
                } catch (error) {}
            })
        }) 
    }

    createSession(authToken, headsetId){
        let socket = this.socket
        const CREATE_SESSION_ID = 5
        let createSessionRequest = { 
            "jsonrpc": "2.0",
            "id": CREATE_SESSION_ID,
            "method": "createSession",
            "params": {
                "cortexToken": authToken,
                "headset": headsetId,
                "status": "active"
            }
        }
        return new Promise(function(resolve, reject){
            socket.send(JSON.stringify(createSessionRequest));
            socket.on('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==CREATE_SESSION_ID){
                        let sessionId = JSON.parse(data)['result']['id']
                        resolve(sessionId)
                    }
                } catch (error) {}
            })
        })
    }

    authorize(){
        let socket = this.socket
        let user = this.user
        return new Promise(function(resolve, reject){
            const AUTHORIZE_ID = 4
            let authorizeRequest = { 
                "jsonrpc": "2.0", "method": "authorize", 
                "params": { 
                    "clientId": user.clientId, 
                    "clientSecret": user.clientSecret, 
                    "license": user.license, 
                    "debit": user.debit
                },
                "id": AUTHORIZE_ID
            }
            socket.send(JSON.stringify(authorizeRequest))
            socket.on('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==AUTHORIZE_ID){
                        let cortexToken = JSON.parse(data)['result']['cortexToken']
                        resolve(cortexToken)
                    }
                } catch (error) {}
            })
        })
    }


    sub(streams){
        this.socket.on('open',async ()=>{
            await this.checkGrantAccessAndQuerySessionInfo()
            this.subRequest(streams, this.authToken, this.sessionId);
            this.socket.on('message', (data)=>{
                if(this.isRecordToSave){
                    this.recordSaved.push(JSON.parse(data));
                    this.numberOfRecords++;
                    this.isRecordToSave = this.numberOfRecords < 10;
                }
            })
        })
    }

    recordResponse(){
        this.isRecordToSave = true;
    }

    getCurrentData(){
        return this.recordSaved;
    }


}

module.exports = Cortex;
