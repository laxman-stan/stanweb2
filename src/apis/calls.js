import axios from "axios";
import { endPoints } from ".";
const REQUEST_TIMEOUT = 5000;

function paramsToUrlQueryParams(params) {
    const esc = encodeURIComponent;
    let query = '';
    if (params) {
        query = '?';
        query += Object.keys(params)
            .map((k) => esc(k) + '=' + esc(params[k]))
            .join('&');
    }
    return query;
}

function isValidStatusCode(statusCode) {
    return Number.isInteger(statusCode) && statusCode > 199 && statusCode < 600;
  }

  function getErrorMesage(response) {
    const defaultMessage = 'Something went wrong!';
    if (!response || !response.data || !response.data.message) {
      return defaultMessage;
    }
    const message = response.data.message;
    if (typeof message === 'string') {
      return message;
    } else if (Array.isArray(message) && message.length > 0) {
      return message[0];
    } else return defaultMessage;
  }

function isSuccess(response) {
    let status;
    if (response.data && isValidStatusCode(response.data.status)) {
        status = response.data.status;
    } else if (response.data && isValidStatusCode(response.data.statusCode)) {
        status = response.data.statusCode;
    } else {
        status = response.status;
    }
    return status >= 200 && status <= 299;
}

function apiRequest(
    method,
    url,
    headers,
    callbackSuccess,
    params,
    callbackFailure,
    convertParams = true,
    timeout = REQUEST_TIMEOUT,
) {

    if (!window.navigator.onLine) {
        callbackFailure({
            error: 'No internet connection',
            color: 'error'
        })
    }
    let body;
    let query = '';
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        if (convertParams) {
            body = JSON.stringify(params);
        } else {
            body = params;
        }
    } else if (method === 'GET') {
        query = paramsToUrlQueryParams(params);
    }
    //    else if (method === 'JSON_POST') {
    //     body = params;
    //     method = 'POST';
    //   } 
    else if (method === 'DELETE') {
        body = params;
    }
    //   console.log('url', url);
    axios({
        method: method,
        url: url,
        data: body,
        timeout: timeout,
        headers: headers,
    })
        .then((response) => {
            if (isSuccess(response)) {
                callbackSuccess && callbackSuccess(response.data);
            } else {
                callbackFailure && callbackFailure(getErrorMesage(response));
            }
        })
        .catch(({ response }) => {
            console.log('API_CATCH', response, JSON.stringify(response));
            response &&
                callbackFailure &&
                callbackFailure(getErrorMesage(response));
        });
    ;
}

function getHeader() {
    const token = sessionStorage.authToken;
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data',
      };
    }
  }


export function auth(params, callbackSuccess, callbackFailure) {
    let x = parseInt(Math.random()*1000 + 1).toString();
    apiRequest(
        'POST',
        endPoints.baseUrl + endPoints.auth,
        endPoints.header,
        callbackSuccess,
        {
            userId: x
          },
        callbackFailure,
        false
    )
}

export function allPlayersRequest(params, callbackSuccess, callbackFailure) {
    apiRequest(
        'GET',
        endPoints.baseUrl + endPoints.allPlayersEndpoint,
        getHeader(),
        callbackSuccess,
        {},
        callbackFailure,
        false
    )
}

export function myPlayersRequest(params, callbackSuccess, callbackFailure) {
    apiRequest(
        'GET',
        endPoints.baseUrl + endPoints.myPlayers,
        getHeader(),
        callbackSuccess,
        {},
        callbackFailure,
        false
    )
}

export function buyPlayerRequest(params, callbackSuccess, callbackFailure){

    apiRequest(
        'POST',
        endPoints.baseUrl + endPoints.buyPlayer,
        getHeader(),
        callbackSuccess,
        params,
        callbackFailure,
        false
    )
}

export function sellPlayerRequest(params, callbackSuccess, callbackFailure){

    apiRequest(
        'POST',
        endPoints.baseUrl + endPoints.sellPlayer,
        getHeader(),
        callbackSuccess,
        params,
        callbackFailure,
        false
    )
}

export function historyReq( callbackSuccess, callbackFailure){

    apiRequest(
        'GET',
        endPoints.baseUrl + endPoints.history,
        getHeader(),
        callbackSuccess,
        {},
        callbackFailure,
        false
    )
}

export function rewardReq( callbackSuccess, callbackFailure ){
        apiRequest(
            'GET',
            endPoints.baseUrl + endPoints.rewards,
            getHeader(),
            callbackSuccess,
            {},
            callbackFailure,
            false
        )
}

export function redeemRewardReq(param, callbackSuccess, callbackFailure){
    apiRequest(
        'POST',
        endPoints.baseUrl + endPoints.redeem,
        getHeader(),
        callbackSuccess,
        param,
        callbackFailure,
        false
    )
}
export function createTeamReq(param, callbackSuccess, callbackFailure){
    apiRequest(
        'POST',
        endPoints.baseUrl + endPoints.createTeamEndpoint,
        getHeader(),
        callbackSuccess,
        param,
        callbackFailure,
        false
    )
}