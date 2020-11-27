const axios = require('axios');
const crypto = require('crypto');
const qs = require('qs');
const ichimoku = require('ichimoku');
var tulind = require('tulind');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const player = require('play-sound')({player : 'C:/Users/LOTUS/Desktop/mplayer-svn-38117/mplayer.exe' })
const coins = ["BTCUSDT", "LINKUSDT", "XRPUSDT", "EOSUSDT", "BCHUSDT", "ETHUSDT"
, "LTCUSDT", "BNBUSDT", "TRXUSDT", "DOTUSDT", "ADAUSDT"];

const shitcoins = ["YFIUSDT", "SUSHIUSDT", "CRVUSDT", "ETCUSDT", "SXPUSDT", "YFIIUSDT", "UNIUSDT", "AAVEUSDT", "WAVESUSDT"
, "ATOMUSDT", "BANDUSDT", "COMPUSDT", "DEFIUSDT", "VETUSDT", "DASHUSDT", "IOTAUSDT","ALGOUSDT", "XMRUSDT", "XLMUSDT", "XTZUSDT"]

const shiiiiiitcoins = ["RSRUSDT", "TRBUSDT", "BZRXUSDT", "RUNEUSDT", "RLCUSDT",
 "THETAUSDT", "ZILUSDT", "KAVAUSDT", "AVAXUSDT", "ZECUSDT"]



const sound =async ()=>{
  player.play('./media/Susmuz.mp3' , (err)=>{
    console.log(err)
  })
}
const quantity = "0.01" ;

const getSmsPanel = async ()=>{
    let res = await axios({
      method : "POST",
      url : "https://RestfulSms.com/api/Token",
      data : {
         "UserApiKey" : "5e94ea3d54a748b47712ea3d",
         "SecretKey" : "richguys"
      }
    })
    return res.data.TokenKey
  }
  
  const sendSms =async (message) => {
    let token = await getSmsPanel()
  
    let res = await axios({
      method : "POST",
      url : "https://RestfulSms.com/api/MessageSend",
      headers : {
        "x-sms-ir-secure-token" : token
      },
  
      data : {
         "Messages" : [message],
         "MobileNumbers" : ["09904893632"],
         "LineNumber" : "30004650002516",
         "SendDateTime" :"",
         "CanContinueInCaseOfError" : "false"
      }
    })
    console.log(res.data)
  }
  


const binanceConfig = {
  API_KEY: 'YDneln48yl6Iqowx8pRJGLUkEF44sLphFhS6rtscc3SBfEUVRmxLm4oN82H2NypS',
  API_SECRET: 'Z6k6Ur37zGnzOUgWEeIyFEY5FCM2WNuGFNOH7DC7nA4B8qG8iVYIXxuFJPL9Q0Uk',
  HOST_URL: 'https://fapi.binance.com',
};

let CandelList = []
// sleep in ms timeframe
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const buildSign = (data, config) => {
  return crypto.createHmac('sha256', config.API_SECRET).update(data).digest('hex');
};

const privateRequest = async (data, endPoint, type) => {
  const dataQueryString = qs.stringify(data);
  
  const signature = buildSign(dataQueryString, binanceConfig);
  const requestConfig = {
    method: type,
    url: binanceConfig.HOST_URL + endPoint + '?' + dataQueryString + '&signature=' + signature,
    headers: {
       "X-MBX-APIKEY": binanceConfig.API_KEY,
    },
  };

  try {
    
    const response = await axios(requestConfig);
    
    return response;
  }
  catch (err) {
    
    return err;
  }
};

const publicRequest = async (data , endPoint , type) => {
  const dataQueryString = qs.stringify(data)

  const requestConfig ={
    method : type,
    url : binanceConfig.HOST_URL + endPoint + '?' + dataQueryString
  }

  try {
    
    const response = await axios(requestConfig);
    
    return response;
  }
  catch (err) {
    
    return err;
  }

}

let prvPrice = 0

const getSymbolPriceFake =async (symbol) => {
  const data = {
    symbol : symbol
  }

  res=await publicRequest(data , '/fapi/v1/premiumIndex' , 'GET')
  if(res.data == undefined)
  {
    const pp = {
      price : prvPrice
    }
    return pp
  }

  prvPrice = res.data.price
  
  return res.data

}


const getSymbolPrice =async (symbol) => {
  const data = {
    symbol : symbol
  }

  res=await publicRequest(data , '/fapi/v1/ticker/price' , 'GET')
  if(res.data == undefined)
  {
    const pp = {
      price : prvPrice
    }
    return pp
  }

  prvPrice = res.data.price
  
  return res.data

}


const setTradeOrder = async(symbol , side , positionSide ,  quantity , price ) =>{

  const data = {
    symbol: symbol,
    side : side,
    quantity : quantity,
    price : price,
    timestamp: Date.now(),
    type : "LIMIT",
    timeInForce : "GTC",
    positionSide : positionSide
  };
  

  res=await privateRequest(data , '/fapi/v1/order' , 'POST')
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
    return res.data
  }
  
}

const cancelAllOpenOrders = async(symbol) =>{
  const data ={
    symbol : symbol,
    timestamp :Date.now()
  }
}


const cancleOrderById = async(symbol , orderId)=>{
  const data ={
    symbol : symbol,
    orderId : orderId,
    timestamp :Date.now()
  }

  res=await privateRequest(data , '/fapi/v1/order' , 'DELETE')
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
    return res.data
  }
}



const changeSymbolLeverage = async(symbol , leverage) => {
  const data = {
    symbol : symbol ,
    leverage : leverage,
    timestamp: Date.now()
  }

  res=await privateRequest(data , '/fapi/v1/leverage' , 'POST')
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
    return res.data
  }
}

const changePositionType = async (type)=>{
  const data = {
    dualSidePosition : type,
    timestamp: Date.now()
  }
  res=await privateRequest(data , '/fapi/v1/positionSide/dual' , 'POST')
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
    return res.data
  }
}


const getCandleBarData = async (symbol , interval) => {
  const data ={
    symbol : symbol,
    interval : interval,
    limit : 150
  }
  let res = await publicRequest(data , '/fapi/v1/klines' , 'GET')
  
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
     return res.data
    
    
  }
}

const getCandleBarDataForRsi = async (symbol , interval) => {
  const data ={
    symbol : symbol,
    interval : interval,
    limit : 500
  }
  let res = await publicRequest(data , '/fapi/v1/klines' , 'GET')
  
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
     return res.data
    
    
  }
}



const getOpenPostitions = async (symbol)=>{
  data = {
    symbol : symbol,
    timestamp: Date.now()
  }
  let res=await privateRequest(data , '/fapi/v2/positionRisk' , 'GET')
  if(res.response != undefined && res.response.status == 400)
  {
    
    return res.response.data
  }
  else{
    
    return res.data
  }
}
const getPositionInformation = async(symbol)=>{
  const data = {
    symbol: symbol,
    timestamp: Date.now(),
  };
  res=await privateRequest(data , '/fapi/v2/positionRisk' , 'GET')
  if(res.response != undefined && res.response.status == 400)
  {
    return res.response.data
  }
  else{
    return res.data
  }
}









// const rsi = async () =>{

//   let candels = await getCandleBarDataForRsi(symbol= "BNBUSDT" , interval ="1h")
  
//   candels = candels.reverse()
//   // console.log(candels[0])
//   let closes =[]
//   for(let i = 0 ; i< 249 ; i++)
//   {
//     closes.push(candels[i][4])
//   }
//   closes.reverse()
//   console.log(closes)
//   tulind.indicators.rsi.indicator([closes] , [14] , (err , result)=>{
//     let res = result[0]
//     res = res.reverse()
//     console.log(res)
//   })
// }



const ema = async (symbol, interval)=> {

    let candels = await getCandleBarDataForRsi(symbol = symbol , interval = interval)
    candels = candels.reverse()
    let closes =[]
    for(let i = 0 ; i< 349 ; i++)
    {
        closes.push(candels[i][4])
    }
    closes=closes.reverse()
    
    let ema7 = []
    tulind.indicators.ema.indicator([closes] , [7] , (err , result)=>{
        let res = result[0]
        res.reverse()
        ema7 = res ;
   
    })
    
    let ema25 = []
    tulind.indicators.ema.indicator([closes] , [25] , (err , result)=>{
        let res = result[0]
        res.reverse()
        ema25 = res ;
        
    })

    let ema99 = []
    tulind.indicators.ema.indicator([closes] , [99] , (err , result)=>{
        let res = result[0]
        res.reverse()
        ema99 = res ;
        
    })  
    let res = []
    res.push(ema7)
    res.push(ema25)
    res.push(ema99)
    return res
}

const checkEmaCollision = async() => {
    while(true){
        let list = []
        const intervals = ["5m", "15m", "1h", "4h", "1d"]
        for(let j=0; j<intervals.length; j++){

          // for 1h
          // for coins
          for(let i =0; i<coins.length; i++){
              let ema7 =[]
              let ema25 =[]
              let ema99 =[]
              let res = await ema(coins[i],intervals[j])
              ema7 = res[0]
              ema25 = res[1]
              ema99 = res[2]
             
              // checking for collision 7 & 25
              if ( (ema7[0]-ema25[0]) * (ema7[1]-ema25[1]) < 0 ){
                  const signal = {
                    symbol : coins[i],
                    interval : intervals[j]
                  }
                  list.push(signal)
              }   
              if ( (ema7[0]-ema99[0]) * (ema7[1]-ema99[1]) < 0 ){
                  const signal = {
                      symbol : coins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              }   
              if ( (ema25[0]-ema99[0]) * (ema25[1]-ema99[1]) < 0 ){
                  const signal = {
                      symbol : coins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              } 
          }

          // for shit coins
          for(let i =0; i<shitcoins.length; i++){
              let ema7 =[]
              let ema25 =[]
              let ema99 =[]
              let res = await ema(shitcoins[i], intervals[j])
              ema7 = res[0]
              ema25 = res[1]
              ema99 = res[2]
              
              // checking for collision 7 & 25
              if ( (ema7[0]-ema25[0]) * (ema7[1]-ema25[1]) < 0 ){
                  const signal = {
                      symbol : shitcoins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              }   
              if ( (ema7[0]-ema99[0]) * (ema7[1]-ema99[1]) < 0 ){
                  const signal = {
                      symbol : shitcoins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              }   
              if ( (ema25[0]-ema99[0]) * (ema25[1]-ema99[1]) < 0 ){
                  const signal = {
                      symbol : shitcoins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              } 
          }

          //for shiiiit coins
          for(let i =0; i<shiiiiiitcoins.length; i++){
              let ema7 =[]
              let ema25 =[]
              let ema99 =[]
              let res = await ema(shiiiiiitcoins[i], intervals[j])
              ema7 = res[0]
              ema25 = res[1]
              ema99 = res[2]
              // checking for collision 7 & 25
              if ( (ema7[0]-ema25[0]) * (ema7[1]-ema25[1]) < 0 ){
                  const signal = {
                      symbol : shiiiiiitcoins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              }   
              // checking for collision 7 & 99
              if ( (ema7[0]-ema99[0]) * (ema7[1]-ema99[1]) < 0 ){
                  const signal = {
                      symbol : shiiiiiitcoins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              }   
              // checking for collision 25 & 99
              if ( (ema25[0]-ema99[0]) * (ema25[1]-ema99[1]) < 0 ){
                  const signal = {
                      symbol : shiiiiiitcoins[i],
                      interval : intervals[j]
                  }
                  list.push(signal)
              } 
              }
          
        
          }
         
          if(list.length >0){
          let message = "ن"
          for(let i =0 ; i<list.length ; i++){
              message = message+" "+ list[i].symbol +", " 
          }
          sendSms(message)
           
          message = '';
  }

           console.log(list)

    }
}

checkEmaCollision()