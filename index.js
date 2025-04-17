function displayUserInfo( urlSync, username ) {
    // Cập nhật và hiển thị thông tin người dùng
    if ( document.getElementById( 'yamaha-ex-display-url-sync' ) ) {
        document.getElementById( 'yamaha-ex-display-url-sync' ).textContent = 'URL Sync: ' + urlSync;
    }
    if ( document.getElementById( 'yamaha-ex-display-username' ) ) {
        document.getElementById( 'yamaha-ex-display-username' ).textContent = 'Username: ' + username;
    }
    if ( document.getElementById( 'yamaha-ex-login-form' ) ) {
        document.getElementById( 'yamaha-ex-login-form' ).style.display = 'none'; // Ẩn form đăng nhập
    }
    if ( document.getElementById( 'yamaha-ex-user-info' ) ) {
        document.getElementById( 'yamaha-ex-user-info' ).style.display = 'block'; // Hiển thị thông tin người dùng
    }
}

const loginBtn = document.getElementById( 'yamaha-ex-login-btn' );

if ( loginBtn !== null ) {
    loginBtn.addEventListener( 'click', function () {
        const urlSync = document.getElementById( 'yamaha-ex-url-sync' ).value;
        const username = document.getElementById( 'yamaha-ex-username' ).value;
        const password = document.getElementById( 'yamaha-ex-password' ).value;

        // Lưu vào Local Storage
        chrome.storage.local.set( { 'urlSync': urlSync, 'username': username, 'password': password }, function () {
            console.log( 'Thành công', 'Thông tin đã được lưu.', 'success' );
            displayUserInfo( urlSync, username );
        } );
    } );

}

function clearUserInfo() {
    console.log( 'clear info' );
    // Cập nhật và hiển thị thông tin người dùng
    document.getElementById( 'yamaha-ex-display-url-sync' ).textContent = '';
    document.getElementById( 'yamaha-ex-display-username' ).textContent = '';
    document.getElementById( 'yamaha-ex-url-sync' ).value = '';
    document.getElementById( 'yamaha-ex-username' ).value = '';
    document.getElementById( 'yamaha-ex-password' ).value = '';
    chrome.storage.local.clear( function () {
        console.log( 'Thành công', 'Thông tin đã được xóa.', 'success' );
    } )

    document.getElementById( 'yamaha-ex-login-form' ).style.display = 'block'; // Ẩn form đăng nhập
    document.getElementById( 'yamaha-ex-user-info' ).style.display = 'none'; // Hiển thị thông tin người dùng
}

const getBtn = document.getElementById( 'yamaha-ex-get-btn' );
if ( getBtn !== null ) {
    getBtn.addEventListener( 'click', function () {
        retrieveInformation()
    } );
}

const clearBtn = document.getElementById( 'yamaha-ex-clear-btn' );
if ( clearBtn !== null ) {
    clearBtn.addEventListener( 'click', function () {
        clearUserInfo();
    } );
}


function retrieveInformation() {
    chrome.storage.local.get( [ 'urlSync', 'username', 'password' ], function ( items ) {
        if ( items.urlSync && items.username ) {
            displayUserInfo( items.urlSync, items.username );
            // Đã đăng nhập, hiển thị thông tin hoặc chuyển trang
            return items;
        } else {
            // Chưa đăng nhập, quay lại trang đăng nhập
            console.log( 'Warning', 'Yamaha extension chưa được đăng nhập', 'danger' );
            return null;
        }
    } );
}

retrieveInformation();
