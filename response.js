// UI Component with Tailwind CSS
class OverlayLoading {
    constructor() {
        this.init();
    }

    init() {
        // Create overlay element with Tailwind-inspired styles
        this.overlay = document.createElement('div');
        this.overlay.className = 'fixed inset-0 bg-black bg-opacity-60 hidden z-50 flex justify-center items-center';

        // Create loader element
        this.loader = document.createElement('div');
        this.loader.className = 'w-14 h-14 border-4 border-gray-300 border-t-yamaha-blue rounded-full animate-spin';

        this.overlay.appendChild(this.loader);
        document.body.insertAdjacentElement('afterbegin', this.overlay);
    }

    show() {
        this.overlay.style.display = 'flex';
    }

    hide() {
        this.overlay.style.display = 'none';
    }
}

class PopupAlert {
    constructor() {
        this.container = this._createContainer();
        document.body.appendChild(this.container);
    }

    _createContainer() {
        const container = document.createElement('div');
        container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        return container;
    }

    _createAlert(title, message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `flex items-start p-3 mb-1 rounded-md bg-white shadow-lg transform transition-all duration-300 ${type === 'success' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
            }`;
        alertDiv.style.width = '280px';

        const iconClass = type === 'success' ? 'text-green-500' : 'text-red-500';
        const icon = document.createElement('span');
        icon.className = `${iconClass} text-xl font-bold mr-2`;
        icon.innerText = type === 'success' ? '✔' : '✘';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex-1';

        const titleElem = document.createElement('p');
        titleElem.className = 'font-semibold text-gray-800 mb-0.5';
        titleElem.innerText = title;

        const messageElem = document.createElement('p');
        messageElem.className = 'text-gray-600 text-sm';
        messageElem.innerText = message;

        contentDiv.appendChild(titleElem);
        contentDiv.appendChild(messageElem);
        alertDiv.appendChild(icon);
        alertDiv.appendChild(contentDiv);

        return alertDiv;
    }

    showAlert(title, message, type = 'success', timeout = 4000) {
        const alertDiv = this._createAlert(title, message, type);
        this.container.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.style.transform = 'translateX(100%)';
            alertDiv.style.opacity = '0';

            setTimeout(() => {
                if (this.container.contains(alertDiv)) {
                    this.container.removeChild(alertDiv);
                }
            }, 400);
        }, timeout);
    }
}

// Create sync button for motorcycles with Tailwind-inspired classes
function createSyncButton() {
    const button = document.createElement("button");
    button.innerHTML = `
    <span class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Lấy Dữ Liệu
    </span>
  `;
    button.className = "bg-yamaha-blue hover:bg-yamaha-lightblue text-white font-medium py-2 px-4 rounded transition duration-300 flex items-center mt-3 mb-3 cursor-pointer";
    return button;
}

// Create sync button for motor parts with Tailwind-inspired classes
function createMotorPartsSyncButton() {
    const button = document.createElement('button');
    button.innerHTML = `
    <span class="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Đồng bộ tất cả
    </span>
  `;
    button.setAttribute('id', 'syncAllOrdersButton');
    button.className = "bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded border-2 border-red-600 transition duration-300 flex items-center cursor-pointer ml-2";
    return button;
}


// Utilities
const Utils = {
    base64: {
        encode(input) {
            try {
                return btoa(encodeURIComponent(input));
            } catch (e) {
                console.error('Base64 encode error:', e);
                return '';
            }
        },

        decode(input) {
            try {
                return decodeURIComponent(atob(input));
            } catch (e) {
                console.error('Base64 decode error:', e);
                return '';
            }
        }
    },

    formUrlencode(data) {
        if (!data || typeof data !== 'object') return '';
        return Object.keys(data)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
            .join('&');
    },

    parseJsonSafe(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('JSON parse error:', e);
            return null;
        }
    },

    stringify(data) {
        try {
            return JSON.stringify(data);
        } catch (e) {
            console.error('JSON stringify error:', e);
            return '';
        }
    }
};

// Data Management
class YamahaExtensionData {
    constructor() {
        this.currentPoint = {};
        this.loadCurrentPoint();
    }

    loadCurrentPoint() {
        try {
            const headerElement = parent.document.getElementById('top_content_top');
            if (!headerElement) return null;

            const pointCodeElement = headerElement.querySelector('[name="currentPointCd"]');
            const pointNameElement = headerElement.querySelector('[name="currentPointName"]');
            const pointUuidElement = headerElement.querySelector('[name="currentPointUid"]');
            const loggingNameElement = headerElement.querySelector('.navPanel .loginUser');

            const pointCode = pointCodeElement?.value;
            const pointName = pointNameElement?.value;
            const pointUuid = pointUuidElement?.value;
            const loggingName = loggingNameElement?.innerText;

            if (pointName && pointCode && pointUuid && loggingName) {
                this.currentPoint = {
                    point_uuid: pointUuid,
                    point_name: pointName,
                    point_code: pointCode,
                    logging_name: loggingName
                };
            }
        } catch (error) {
            console.error('Failed to load current point:', error);
        }
    }

    async loadUserCredentials() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['urlSync', 'username', 'password'], (items) => {
                if (items.urlSync && items.username && items.password) {
                    resolve(items);
                } else {
                    reject(new Error('No credentials found'));
                }
            });
        });
    }
}

// API Handler
class YamahaApiHandler {
    constructor(yamahaData, ui) {
        this.yamahaData = yamahaData;
        this.ui = ui;
        this.token = '';
    }

    async login() {
        try {
            const credentials = await this.yamahaData.loadUserCredentials();

            const response = await fetch(`${credentials.urlSync}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: Utils.stringify({
                    userName: credentials.username,
                    password: credentials.password
                })
            });

            if (!response.ok) {
                this.ui.popup.showAlert('Lỗi đăng nhập', `${response.statusText}`, 'error');
                throw new Error('Login failed');
            }

            const data = await response.json();
            if (data.status && data.data?.access_token) {
                this.token = data.data.access_token;
                return this.token;
            }

            throw new Error('No token received');
        } catch (error) {
            console.error('Login error:', error);
            return '';
        }
    }

    async syncData(pathSync, dataToSync) {
        if (!pathSync) {
            this.ui.popup.showAlert('Lỗi', 'Không thấy đường dẫn đồng bộ', 'error', 6000);
            return false;
        }

        if (!this.token) {
            await this.login();
            if (!this.token) {
                this.ui.popup.showAlert('Lỗi', 'Đăng nhập để đồng bộ thất bại', 'error', 6000);
                return false;
            }
        }

        try {
            const credentials = await this.yamahaData.loadUserCredentials();

            const response = await fetch(`${credentials.urlSync}${pathSync}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: Utils.stringify(dataToSync)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                this.ui.popup.showAlert('Lỗi', `Đồng bộ dữ liệu thất bại! ${errorResponse.message}`, 'error', 6000);
                return false;
            }

            const result = await response.json();
            if (result?.status) {
                return true;
            }

            this.ui.popup.showAlert('Lỗi', 'Đồng bộ dữ liệu thất bại, dữ liệu trả về không hợp lệ', 'error');
            return false;
        } catch (error) {
            console.error('API sync error:', error);
            this.ui.popup.showAlert('Lỗi', 'Lỗi kết nối mạng hoặc máy chủ', 'error', 6000);
            return false;
        }
    }
}

// Data Processors
class MotorcycleDataProcessor {
    static getInfoParent() {
        const inputs = document.querySelectorAll('input[name^="resultModel."]');
        const resultModel = {};

        inputs.forEach(function (input) {
            const propertyName = input.name.replace('resultModel.', '');
            resultModel[propertyName] = input.value;
        });

        return resultModel;
    }

    static getOrderDetail() {
        const xmlContainer = document.getElementById("resultDhtmlxGridXML");
        if (!xmlContainer) return [];

        try {
            const xmlData = xmlContainer.innerHTML;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "text/xml");
            const rows = xmlDoc.querySelectorAll("row");

            return Array.from(rows).map(row => {
                const obj = {};
                row.querySelectorAll("cell").forEach((cell, index) => {
                    obj[`cell${index}`] = cell.textContent;
                });
                return obj;
            });
        } catch (error) {
            console.error('Error parsing grid data:', error);
            return [];
        }
    }
}

class MotorPartsDataProcessor {
    static async getOrderDetail(token, orderId, orderStatus, methodId) {
        const windowToken = "SPM040402Formiframe_" + Date.now();

        const headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "iframe"
        };

        const body = new URLSearchParams({
            "org.apache.struts.taglib.html.TOKEN": token,
            "jp.co.yamaha_motor.commons.web.taglib.h.WINDOWTOKEN": windowToken,
            "resultModel.orderId": orderId,
            "resultModel.btnControl": "true",
            "resultModel.orderStatus": orderStatus,
            "resultModel.methodId": methodId,
            "resultModel.supplierOrderNo": "",
            "resultModel.confirmDate": ""
        }).toString();

        try {
            const response = await fetch("SPM040402.do", {
                headers,
                referrer: "SPM040401Retrieve.do",
                body,
                method: "POST",
                mode: "cors",
                credentials: "include"
            });

            const data = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const xmlContainer = doc.getElementById("resultDhtmlxGridXML");

            if (xmlContainer) {
                const xmlData = xmlContainer.innerHTML;
                const xmlDoc = parser.parseFromString(xmlData, "text/xml");
                const rows = xmlDoc.querySelectorAll("row");

                return Array.from(rows).map(row => {
                    const obj = {};
                    row.querySelectorAll("cell").forEach((cell, index) => {
                        obj[`cell${index}`] = cell.textContent;
                    });
                    return obj;
                });
            }

            return [];
        } catch (error) {
            console.error('Error fetching order details:', error);
            return [];
        }
    }
}

// Feature modules
class MotorcycleSyncFeature {
    constructor(yamahaData, apiHandler, ui) {
        this.yamahaData = yamahaData;
        this.apiHandler = apiHandler;
        this.ui = ui;
        this.init();
    }

    init() {
        const generalInfoTable = document.getElementById("GeneralInfoTbl");
        if (!generalInfoTable) return;

        const functionName = document.querySelector('input[name="resultModel.updateProgram"]');
        if (functionName?.value !== 'Báo cáo nhận xe nhanh') return;

        const button = this.createSyncButton();
        generalInfoTable.parentNode.insertBefore(button, generalInfoTable.nextSibling);

        button.addEventListener('click', this.handleSync.bind(this));
    }

    createSyncButton() {
        const button = document.createElement("button");
        button.innerHTML = "Lấy Dữ Liệu";
        Object.assign(button.style, {
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer"
        });
        return button;
    }

    async handleSync() {
        this.ui.overlay.show();
        try {
            const dataOrder = MotorcycleDataProcessor.getInfoParent();
            dataOrder.listData = MotorcycleDataProcessor.getOrderDetail();

            const token = await this.apiHandler.login();
            if (!token) {
                this.ui.popup.showAlert('Lỗi', 'Đăng nhập thất bại để đồng bộ', 'error');
                return;
            }

            const syncResult = await this.apiHandler.syncData('extension/import-orders', dataOrder);
            if (syncResult) {
                this.ui.popup.showAlert('Thành công', 'Đồng bộ thành công, đơn hàng đã cất -> không đồng bộ lại');
            } else {
                this.ui.popup.showAlert('Lỗi', 'Đồng bộ dữ liệu đơn hàng xe thất bại', 'error');
            }
        } catch (error) {
            console.error('Motorcycle sync error:', error);
            this.ui.popup.showAlert('Lỗi', 'Đã xảy ra lỗi khi đồng bộ', 'error');
        } finally {
            this.ui.overlay.hide();
        }
    }
}

class MotorPartsSyncFeature {
    constructor(yamahaData, apiHandler, ui) {
        this.yamahaData = yamahaData;
        this.apiHandler = apiHandler;
        this.ui = ui;
        this.init();
    }

    init() {
        const collapseElements = document.querySelectorAll('#SPM040401Form .collapse');
        if (!collapseElements || collapseElements.length < 2) return;

        const secondCollapseElement = collapseElements[1];
        const colBtnContainer = secondCollapseElement.querySelector('.ui-accordion .ui-accordion-header .colBtnContainer');
        if (!colBtnContainer) return;

        const button = this.createSyncButton();
        colBtnContainer.appendChild(button);

        button.addEventListener('click', this.handleSync.bind(this));
    }

    createSyncButton() {
        const button = document.createElement('button');
        button.innerHTML = '<span class="ui-button-icon-primary ui-icon ui-icon-refresh"></span><span class="ui-button-text"><span class="label">Đồng bộ tất cả</span></span>';
        button.setAttribute('id', 'syncAllOrdersButton');
        button.setAttribute('class', 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary');
        button.setAttribute('type', 'button');
        button.setAttribute('title', 'Đồng bộ tất cả đơn hàng');
        button.style.color = "red";
        button.style.border = "2px solid red";
        return button;
    }

    async handleSync() {
        this.ui.popup.showAlert('Đang xử lý', 'Đang xử lý đồng bộ', 'success');
        this.ui.overlay.show();

        try {
            const tableGridResultElement = document.querySelector('#SPM040401Form #resultDhtmlxGridID table tbody tr');
            if (!tableGridResultElement) {
                this.ui.popup.showAlert('Lỗi', 'Không tìm thấy bảng dữ liệu', 'error');
                return;
            }

            const listOrders = MotorcycleDataProcessor.getOrderDetail();
            if (!listOrders.length) {
                this.ui.popup.showAlert('Lỗi', 'Không tìm thấy đơn hàng nào cần đồng bộ', 'error');
                return;
            }

            if (Object.keys(this.yamahaData.currentPoint).length === 0) {
                this.ui.popup.showAlert('Lỗi', 'Lỗi khi lấy thông tin cửa hàng hiện tại, tải lại trang để đồng bộ!', 'error');
                return;
            }

            const token = await this.apiHandler.login();
            if (!token) return;

            const formToken = document.querySelector('#SPM040402Form input[name="org.apache.struts.taglib.html.TOKEN"]');
            if (!formToken) {
                this.ui.popup.showAlert('Lỗi', 'Không tìm thấy token form', 'error');
                return;
            }

            let successCount = 0;

            for (const order of listOrders) {
                try {
                    const orderData = {
                        'current_session': this.yamahaData.currentPoint,
                        'yamaha_order_uuid': order['cell1'],
                        'yamaha_order_code': order['cell2'],
                        'yamaha_order_code_provider': order['cell3'],
                        'order_date': order['cell4'],
                        'submit_date': order['cell5'],
                        'status': order['cell6'],
                        'type': order['cell8'],
                        'method': order['cell9'],
                        'supplier_code': order['cell10'],
                        'supplier_name': order['cell11'],
                        'store_code': order['cell12'],
                        'store_name': order['cell13'],
                        'delivery_date': order['cell14'],
                        'quantity': order['cell15'],
                        'total_amount': order['cell16'],
                        'purchaser': order['cell17'],
                        'listItem': []
                    };

                    console.log(`Lấy thông tin đơn hàng: ${order['cell1']}, ${order['cell6']}, ${order['cell2']}`);

                    const detailItems = await MotorPartsDataProcessor.getOrderDetail(
                        formToken.value, order['cell1'], order['cell6'], order['cell2']
                    );

                    if (detailItems && detailItems.length > 0) {
                        orderData.listItem = detailItems.map(item => ({
                            part_code: item['cell0'],
                            part_name: item['cell1'],
                            yamaha_part_uuid: item['cell2'],
                            price: item['cell3'],
                            min_order_quantity: item['cell4'],
                            lot_order_quantity: item['cell5'],
                            order_quantity: item['cell6'],
                            total_amount: item['cell7'],
                            cancel_by_debt: item['cell8']
                        }));
                    }

                    const syncResult = await this.apiHandler.syncData('extension/sync-orders-motor-parts', orderData);
                    if (syncResult) {
                        this.ui.popup.showAlert('Thành công', `Đồng bộ thành công: ${orderData.yamaha_order_code}`, 'success');
                        successCount++;
                    }
                } catch (error) {
                    console.error(`Error processing order ${order['cell2']}:`, error);
                    this.ui.popup.showAlert('Lỗi', `Lỗi xử lý đơn hàng ${order['cell2']}`, 'error');
                }
            }

            if (successCount > 0) {
                this.ui.popup.showAlert('Hoàn tất', `Đồng bộ thành công ${successCount} đơn hàng`, 'success');
            } else if (listOrders.length > 0) {
                this.ui.popup.showAlert('Cảnh báo', 'Không có đơn hàng nào được đồng bộ thành công', 'error');
            }
        } catch (error) {
            console.error('Motor parts sync error:', error);
            this.ui.popup.showAlert('Lỗi', 'Đã xảy ra lỗi khi đồng bộ', 'error');
        } finally {
            this.ui.overlay.hide();
        }
    }
}

// Main application
class YamahaExtension {
    constructor() {
        this.ui = {
            overlay: new OverlayLoading(),
            popup: new PopupAlert()
        };

        this.yamahaData = new YamahaExtensionData();
        this.apiHandler = new YamahaApiHandler(this.yamahaData, this.ui);

        // Initialize features
        this.motorcycleSync = new MotorcycleSyncFeature(this.yamahaData, this.apiHandler, this.ui);
        this.motorPartsSync = new MotorPartsSyncFeature(this.yamahaData, this.apiHandler, this.ui);
    }
}

// Start the extension
document.addEventListener('DOMContentLoaded', () => {
    const app = new YamahaExtension();
});