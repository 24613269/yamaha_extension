// Khởi tạo overlay
function initializeOverlayLoading() {
    const overlayDiv = document.createElement( 'div' );
    overlayDiv.classList.add( 'overlay-loading' );
    overlayDiv.style.position = 'fixed';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.background = 'rgba(0, 0, 0, 0.6)';
    overlayDiv.style.display = 'none';
    overlayDiv.style.justifyContent = 'center';
    overlayDiv.style.alignItems = 'center';
    overlayDiv.style.zIndex = '9999';

    const loaderDiv = document.createElement( 'div' );
    loaderDiv.classList.add( 'loader' );
    loaderDiv.style.border = '8px solid #f3f3f3';
    loaderDiv.style.borderRadius = '50%';
    loaderDiv.style.borderTop = '8px solid blue';
    loaderDiv.style.width = '50px';
    loaderDiv.style.height = '50px';
    loaderDiv.style.animation = 'spin 1s linear infinite';

    const styleElement = document.createElement( 'style' );
    styleElement.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild( styleElement );
    overlayDiv.appendChild( loaderDiv );
    document.body.insertAdjacentElement( 'afterbegin', overlayDiv );
}

// Hàm hiển thị overlay
function showOverlay() {
    const overlay = document.querySelector( '.overlay-loading' );
    if ( overlay ) overlay.style.display = 'flex';
}

// Hàm ẩn overlay
function hideOverlay() {
    const overlay = document.querySelector( '.overlay-loading' );
    if ( overlay ) overlay.style.display = 'none';
}


/*alert popup*/
class PopupAlert {
    constructor() {
        this.container = this._createContainer();
        document.body.appendChild( this.container );
    }

    _createContainer() {
        const container = document.createElement( 'div' );
        container.style.position = 'fixed';
        container.style.right = '10px';
        container.style.bottom = '10px';
        container.style.zIndex = '9999';
        return container;
    }

    _createAlert( title, message, type ) {
        const alertDiv = document.createElement( 'div' );
        alertDiv.style.display = 'flex';
        alertDiv.style.alignItems = 'center';
        alertDiv.style.padding = '10px';
        alertDiv.style.marginBottom = '10px';
        alertDiv.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.2)';
        alertDiv.style.backgroundColor = '#ffffff';
        alertDiv.style.borderLeft = type === 'success' ? '5px solid green' : '5px solid red';
        alertDiv.style.width = '250px';
        alertDiv.style.color = '#000';
        alertDiv.style.borderRadius = "5px";
        alertDiv.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
        alertDiv.style.transform = 'translateX(0)';
        alertDiv.style.opacity = '1';

        const icon = document.createElement( 'span' );
        icon.innerText = type === 'success' ? '✔' : '✘';
        icon.style.color = type === 'success' ? 'green' : 'red';
        icon.style.fontSize = '1.5em';
        icon.style.marginRight = '10px';
        icon.style.flexShrink = '0';  // Đảm bảo rằng biểu tượng không bị co lại khi có nhiều nội dung

        const contentDiv = document.createElement( 'div' );
        contentDiv.style.flexGrow = '1';  // Cho phép nội dung mở rộng

        const titleElem = document.createElement( 'strong' );
        titleElem.innerText = title;
        titleElem.style.display = 'block';  // Chắc chắn rằng tiêu đề xuất hiện trên một dòng riêng

        const messageElem = document.createElement( 'p' );
        messageElem.innerText = message;
        messageElem.style.margin = '0';  // Loại bỏ margin mặc định của thẻ <p>

        contentDiv.appendChild( titleElem );
        contentDiv.appendChild( messageElem );
        alertDiv.appendChild( icon );
        alertDiv.appendChild( contentDiv );

        return alertDiv;
    }


    showAlert( title, message, type = 'success', timeout = 4000 ) {
        const alertDiv = this._createAlert( title, message, type );
        this.container.appendChild( alertDiv );

        setTimeout( () => {
            alertDiv.style.transform = 'translateX(100%)';
            alertDiv.style.opacity = '0';
            setTimeout( () => {
                this.container.removeChild( alertDiv );
            }, 400 );
        }, timeout );
    }
}

// Khởi tạo đối tượng PopupAlert, overlay loading
const popup = new PopupAlert();
// Khởi tạo overlay khi tài liệu đã sẵn sàng
initializeOverlayLoading()

function retrieveInformation2() {
    return new Promise( ( resolve, reject ) => {
        chrome.storage.local.get( [ 'urlSync', 'username', 'password' ], function ( items ) {
            if ( items.urlSync && items.username ) {
                resolve( items );
            } else {
                console.log( 'Warning', 'Yamaha extension chưa được đăng nhập', 'danger' );
                popup.showAlert( 'Chưa đăng nhập', 'Yamaha Extension chưa được đăng nhập', 'danger' );
                resolve( null );
            }
        } );
    } );
}


/*Kết thúc khởi tạo giao diện*/

/*==============common begin=================*/
const container = 'y-request';
var INITSTATUS = 0;
var RUNSTATUS = 1;
var ENDSTATUS = 2;


var base64 = _base64();

function encode( data ) {
    return base64.encode( encodeURIComponent( JSON.stringify( data ) ) );
}

function decode( data ) {
    return JSON.parse( decodeURIComponent( base64.decode( data ) ) );
}

function formUrlencode( data ) {
    if ( !data || typeof data !== 'object' ) return ''
    return Object.keys( data ).map( function ( key ) {
        return encodeURIComponent( key ) + '=' + encodeURIComponent( data[key] );
    } ).join( '&' )
}

function _base64() {


    var InvalidCharacterError = function ( message ) {
        this.message = message;
    };
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    var error = function ( message ) {
        throw new InvalidCharacterError( message );
    };

    var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var REGEX_SPACE_CHARACTERS = /<%= spaceCharacters %>/g;

    var decode = function ( input ) {
        input = String( input )
            .replace( REGEX_SPACE_CHARACTERS, '' );
        var length = input.length;
        if ( length % 4 == 0 ) {
            input = input.replace( /==?$/, '' );
            length = input.length;
        }
        if (
            length % 4 == 1 ||
            /[^+a-zA-Z0-9/]/.test( input )
        ) {
            error(
                'Invalid character: the string to be decoded is not correctly encoded.'
            );
        }
        var bitCounter = 0;
        var bitStorage;
        var buffer;
        var output = '';
        var position = -1;
        while ( ++position < length ) {
            buffer = TABLE.indexOf( input.charAt( position ) );
            bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
            if ( bitCounter++ % 4 ) {
                output += String.fromCharCode(
                    0xFF & bitStorage >> ( -2 * bitCounter & 6 )
                );
            }
        }
        return output;
    };

    var encode = function ( input ) {
        input = String( input );
        if ( /[^\0-\xFF]/.test( input ) ) {
            error(
                'The string to be encoded contains characters outside of the ' +
                'Latin1 range.'
            );
        }
        var padding = input.length % 3;
        var output = '';
        var position = -1;
        var a;
        var b;
        var c;
        var d;
        var buffer;
        // Make sure any padding is handled outside of the loop.
        var length = input.length - padding;

        while ( ++position < length ) {
            // Read three bytes, i.e. 24 bits.
            a = input.charCodeAt( position ) << 16;
            b = input.charCodeAt( ++position ) << 8;
            c = input.charCodeAt( ++position );
            buffer = a + b + c;
            output += (
                TABLE.charAt( buffer >> 18 & 0x3F ) +
                TABLE.charAt( buffer >> 12 & 0x3F ) +
                TABLE.charAt( buffer >> 6 & 0x3F ) +
                TABLE.charAt( buffer & 0x3F )
            );
        }

        if ( padding == 2 ) {
            a = input.charCodeAt( position ) << 8;
            b = input.charCodeAt( ++position );
            buffer = a + b;
            output += (
                TABLE.charAt( buffer >> 10 ) +
                TABLE.charAt( ( buffer >> 4 ) & 0x3F ) +
                TABLE.charAt( ( buffer << 2 ) & 0x3F ) +
                '='
            );
        } else if ( padding == 1 ) {
            buffer = input.charCodeAt( position );
            output += (
                TABLE.charAt( buffer >> 2 ) +
                TABLE.charAt( ( buffer << 4 ) & 0x3F ) +
                '=='
            );
        }

        return output;
    };

    return {
        'encode': encode,
        'decode': decode,
        'version': '<%= version %>'
    };
};

/*==============common end=================*/
//get current point - cua hang hien tai
let CURRENT_POINT_LOGIN = {}

function getCurrentPoint() {
    try {
        let headerElement = parent.document.getElementById( 'top_content_top' );
        let point_code_element = headerElement.querySelector( '[name="currentPointCd"]' );
        let point_code = point_code_element?.value;
        let point_name_element = headerElement.querySelector( '[name="currentPointName"]' );
        let point_name = point_name_element?.value;
        let point_uuid_element = headerElement.querySelector( '[name="currentPointUid"]' );
        let point_uuid = point_uuid_element?.value;

        let logging_name_element = headerElement.querySelector( '.navPanel .loginUser' );
        let logging_name = logging_name_element?.innerText;
        if ( point_name && point_code && point_uuid && logging_name ) {
            // nếu có thì cập nhật
            CURRENT_POINT_LOGIN.point_uuid = point_uuid;
            CURRENT_POINT_LOGIN.point_name = point_name;
            CURRENT_POINT_LOGIN.point_code = point_code;
            CURRENT_POINT_LOGIN.logging_name = logging_name;
        }

    } catch ( error ) {
        return null;
    }
}

//to get current point
getCurrentPoint();

function addBtnSyncMotorcycle() {

    let button = document.createElement( "button" );
    button.innerHTML = "Lấy Dữ Liệu"; // Đặt nội dung của nút

    button.style.backgroundColor = "#007bff";
    button.style.color = "#fff";
    button.style.padding = "10px 20px";
    button.style.border = "none";
    button.style.cursor = "pointer";
    let generalInfoTable = document.getElementById( "GeneralInfoTbl" );

    if ( generalInfoTable ) {
        let functionName = document.querySelector( 'input[name="resultModel.updateProgram"]' );
        if ( functionName?.value === 'Báo cáo nhận xe nhanh' ) {
            generalInfoTable.parentNode.insertBefore( button, generalInfoTable.nextSibling );
        }
    }
    button.onclick = async function () {
        // Logic để đồng bộ tất cả đơn hàng
        showOverlay();
        console.log( 'Đồng bộ đơn hàng!' );
        let dataOrder = getInfoParent();
        dataOrder.listData = getMotorcycleOrderDetail();
        let token = await loginCSM();
        console.log(token);
        if ( token ) {
            let syncOk = await callApiSync( 'extension/import-orders', dataOrder, token );
            console.log(syncOk);
            if ( syncOk )
                popup.showAlert( 'Thành công', 'Đồng bộ thành công, đơn hàng đã cất -> không đồng bộ lại' );
            else {
                popup.showAlert( 'Lỗi', 'Đồng bộ dữ liệu đơn hàng xe thất bại', 'error' );
            }
        } else {
            popup.showAlert( 'Lỗi', 'Đăng nhập thất bại để đồng bộ', 'error' );
        }
        hideOverlay();
    };
}

addBtnSyncMotorcycle();


function addBtnSyncMotorParts() {

    // Tạo nút mới
    let newButton = document.createElement( 'button' );
    newButton.innerHTML = '<span class="ui-button-icon-primary ui-icon ui-icon-refresh"></span><span class="ui-button-text"><span class="label">Đồng bộ tất cả</span></span>';
    newButton.setAttribute( 'id', 'syncAllOrdersButton' );
    newButton.setAttribute( 'name', 'syncAllOrdersButton' );
    newButton.setAttribute( 'class', 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary' );
    newButton.setAttribute( 'type', 'button' );
    newButton.setAttribute( 'role', 'button' );
    newButton.setAttribute( 'aria-disabled', 'false' );
    newButton.setAttribute( 'title', 'Đồng bộ tất cả đơn hàng' );
    newButton.style.color = "red";
    newButton.style.border = "2px solid red"

    newButton.onclick = async function () {
        // Logic để đồng bộ tất cả đơn hàng
        console.log( 'Đồng bộ tất cả đơn hàng!' );
        popup.showAlert( 'Đang xử lý', 'Đang xử lý đồng bộ', 'success' );
        showOverlay();
        await getDataMotorPartOderList();
        hideOverlay();

    };

    const collapseElements = document.querySelectorAll( '#SPM040401Form .collapse' );
    if ( collapseElements ) {
        const secondCollapseElement = collapseElements[1];
        if ( secondCollapseElement ) {
            const colBtnContainer = secondCollapseElement.querySelector( '.ui-accordion .ui-accordion-header .colBtnContainer' );
            if ( colBtnContainer )
                colBtnContainer.appendChild( newButton );
        }

    }
}

async function getDataMotorPartOderList() {
    const tableGridResultElement = document.querySelector( '#SPM040401Form #resultDhtmlxGridID table tbody tr' );
    if ( tableGridResultElement ) {
        //get tr second
        let listOrder = getMotorcycleOrderDetail();
        if ( listOrder?.length === undefined || listOrder.length === 0 ) {
            popup.showAlert( 'Lỗi', 'Không tìm thấy đơn hàng nào cần đồng bộ', 'error' );
        } else {
            console.table( listOrder )
            let idOrderForm = 'SPM040402Form';
            if ( CURRENT_POINT_LOGIN === {} ) {
                popup.showAlert( 'Lỗi', 'Lỗi khi lấy thông tin cửa hàng hiện tại, tải lại trang để đồng bộ!', 'error' );
                return;
            }
            //login
            let token_csm = await loginCSM();
            for ( let i = 0; i < listOrder.length; i++ ) {
                let itemOrder = {
                    'current_session': CURRENT_POINT_LOGIN,
                    'yamaha_order_uuid': listOrder[i]['cell1'],
                    'yamaha_order_code': listOrder[i]['cell2'],
                    'yamaha_order_code_provider': listOrder[i]['cell3'],
                    'order_date': listOrder[i]['cell4'],
                    'submit_date': listOrder[i]['cell5'],
                    'status': listOrder[i]['cell6'],
                    'type': listOrder[i]['cell8'],
                    'method': listOrder[i]['cell9'],
                    'supplier_code': listOrder[i]['cell10'],
                    'supplier_name': listOrder[i]['cell11'],
                    'store_code': listOrder[i]['cell12'],
                    'store_name': listOrder[i]['cell13'],
                    'delivery_date': listOrder[i]['cell14'],
                    'quantity': listOrder[i]['cell15'],
                    'total_amount': listOrder[i]['cell16'],
                    'purchaser': listOrder[i]['cell17'],
                    'listItem': []
                }
                const token = document.querySelector( `#${ idOrderForm } input[name="org.apache.struts.taglib.html.TOKEN"]` ).value;
                console.log( "Lấy thông tin đơn hàng: ", listOrder[i]['cell1'], listOrder[i]['cell6'], listOrder[i]['cell2'] );
                let detailOrder = await sendRequestGetMotorPartOrderDetail( token, listOrder[i]['cell1'], listOrder[i]['cell6'], listOrder[i]['cell2'] );
                console.log( 'Chi tiết đơn hàng: ', detailOrder );
                if ( detailOrder?.length !== undefined || detailOrder.length > 0 ) {
                    for ( let j = 0; j < detailOrder.length; j++ ) {
                        itemOrder.listItem.push( {
                            part_code: detailOrder[j]['cell1'],
                            part_name: detailOrder[j]['cell2'],
                            yamaha_part_uuid: detailOrder[j]['cell3'],
                            price: detailOrder[j]['cell4'],
                            min_order_quantity: detailOrder[j]['cell5'],
                            lot_order_quantity: detailOrder[j]['cell6'],
                            order_quantity: detailOrder[j]['cell7'],
                            total_amount: detailOrder[j]['cell8'],
                            cancel_by_debt: detailOrder[j]['cell9'],
                        } );
                    }
                }

                console.log( 'data sync: ', itemOrder )

                await callApiSync( 'extension/sync-orders-motor-parts', itemOrder, token_csm )
                popup.showAlert( 'Thành công', `Đồng bộ thành công: ${ itemOrder.yamaha_order_code }`, 'success' );
            }
            popup.showAlert( 'Hoàn tất', `Đồng bộ thành công ${ listOrder.length } đơn hàng`, 'success' );
        }
    }

}

addBtnSyncMotorParts();

function sendRequestGetMotorPartOrderDetail( token, orderId, orderStatus, methodId ) {
    const windowToken = "SPM040402Formiframe_" + Date.now();

    const headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,da;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "iframe",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
    };

    const body = new URLSearchParams( {
        "org.apache.struts.taglib.html.TOKEN": token,
        "jp.co.yamaha_motor.commons.web.taglib.h.WINDOWTOKEN": windowToken,
        "resultModel.orderId": orderId,
        "resultModel.btnControl": "true",
        "resultModel.orderStatus": orderStatus,
        "resultModel.methodId": methodId,
        "resultModel.supplierOrderNo": "",
        "resultModel.confirmDate": ""
    } ).toString();

    const requestOptions = {
        headers: headers,
        referrer: "SPM040401Retrieve.do",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: body,
        method: "POST",
        mode: "cors",
        credentials: "include"
    };

    return fetch( "SPM040402.do", requestOptions )
        .then( response => response.text() )
        .then( data => {
            let parser = new DOMParser();
            let doc = parser.parseFromString( data, "text/html" );
            let xmlContainer = doc.getElementById( "resultDhtmlxGridXML" );

            if ( xmlContainer ) {
                let xmlData = xmlContainer.innerHTML;
                let xmlDoc = parser.parseFromString( xmlData, "text/xml" );
                let rows = xmlDoc.querySelectorAll( "row" );
                let objects = [];
                rows.forEach( function ( row ) {
                    let obj = {};
                    row.querySelectorAll( "cell" ).forEach( function ( cell, index ) {
                        obj["cell" + index] = cell.textContent;
                    } );
                    objects.push( obj );
                } );

                return objects
            }
        } )
        .catch( error => {
            popup.showAlert( 'Lỗi', `Không thể lấy thông tin đơn hàng ${ orderId } để đồng bộ`, 'error' );
            console.log( 'Lỗi đồng bộ: ', error )
        } );
}

function getMotorcycleOrderDetail() {
    var xmlContainer = document.getElementById( "resultDhtmlxGridXML" );
    let data = [];
    if ( xmlContainer ) {
        var xmlData = xmlContainer.innerHTML;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString( xmlData, "text/xml" );
        var rows = xmlDoc.querySelectorAll( "row" );
        var objects = [];
        rows.forEach( function ( row ) {
            var obj = {};
            row.querySelectorAll( "cell" ).forEach( function ( cell, index ) {
                obj["cell" + index] = cell.textContent;
            } );
            objects.push( obj );
        } );
        data = objects;

    }
    return data;
}

function getInfoParent() {
    var inputs = document.querySelectorAll( 'input[name^="resultModel."]' );

    var resultModel = {};

    inputs.forEach( function ( input ) {
        var name = input.name;
        var value = input.value;
        var propertyName = name.replace( 'resultModel.', '' );
        resultModel[propertyName] = value;
    } );

    return resultModel;

}

async function loginCSM() {
    try {
        const LOGIN_INFO = await retrieveInformation2();
        console.log( 'LOGIN_INFO: ', LOGIN_INFO );
        if ( !LOGIN_INFO ) {
            console.log( 'Lỗi', "Không tìm thấy thông tin đăng nhập của Extension" );
        }else{
            const response = await fetch( LOGIN_INFO.urlSync + 'login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( {
                    "userName": LOGIN_INFO.username,
                    "password": LOGIN_INFO.password
                } )
            } );
            if ( !response.ok ) {
                popup.showAlert( 'Lỗi đồng bộ', `Đăng nhập thất bại: ${ response.statusText }`, 'error' );
                throw new Error( 'Network response was not ok' );
            }

            const data = await response.json();

            if ( data.status && data.data?.access_token ) {
                return data.data.access_token;
            } else {
                return '';
            }
        }

    } catch ( error ) {
        console.log( "Error:", error );
        return '';  // Trả về chuỗi trống trong trường hợp có lỗi
    }
}


async function callApiSync(pathSync = '', dataOrder, token = '') {
    if (pathSync === '') {
        popup.showAlert('Lỗi', 'Không thấy đường dẫn đồng bộ', 'error', 6000);
        return false;
    }
    if (token === '') {
        popup.showAlert('Lỗi', 'Đăng nhập để đồng bộ thất bại', 'error', 6000);
        return false;
    }

    const LOGIN_INFO = await retrieveInformation2();
    if (!LOGIN_INFO) {
        popup.showAlert('Lỗi', "Không tìm thấy thông tin đăng nhập của Extension.");
        return false;
    }

    try {
        const response = await fetch(LOGIN_INFO.urlSync + pathSync, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(dataOrder)
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            popup.showAlert('Lỗi', `Đồng bộ dữ liệu thất bại! ${errorResponse.message}`, 'error', 6000);
            return false;
        }

        const data_import = await response.json();
        if (data_import?.status) {
            return true;
        } else {
            popup.showAlert('Lỗi', 'Đồng bộ dữ liệu thất bại, dữ liệu trả về không hợp lệ', 'error');
            return false;
        }
    } catch (error) {
        console.log('Error:', error);
        popup.showAlert('Lỗi', 'Lỗi kết nối mạng hoặc máy chủ', 'error', 6000);
        return false;
    }
}


