/**
 * @author Nithin
 */

import { Outlets } from '../outlets/outlets';
import { Order } from '../order/order';
import { StockReturn } from '../stockReturn/stockReturn';


Meteor.methods({
    'firebase:pushNotification': (idVal, bodyText, titleText, notificationType) => {
        console.log("idVal", idVal);
        if (notificationType == 'outletApproval') {
            let outletRes = Outlets.findOne({ _id: idVal }, { fields: { createdBy: 1, name: 1 } });
            if (outletRes) {
                bodyText = `${bodyText} ${outletRes.name}`;
                let userData = Meteor.users.findOne({ _id: outletRes.createdBy }, { fields: { firebaseToken: 1 } });
                if (userData.firebaseToken) {
                    console.log("MSend");
                    notificationCall(userData.firebaseToken, bodyText, titleText, notificationType);
                }
            }
        }
        else if (notificationType == 'stockTransfer') {
            let userData = Meteor.users.findOne({ _id: idVal }, { fields: { firebaseToken: 1 } });
            if (userData.firebaseToken) {
                console.log("MSend");
                notificationCall(userData.firebaseToken, bodyText, titleText, notificationType);
            }
        }
        else if (notificationType == 'orderApproval') {
            let orderRes = Order.findOne({ _id: idVal }, { fields: { sdUser: 1 } });
            if (orderRes) {
                let userData = Meteor.users.findOne({ _id: orderRes.sdUser }, { fields: { firebaseToken: 1 } });
                if (userData.firebaseToken) {
                    console.log("MSend");
                    notificationCall(userData.firebaseToken, bodyText, titleText, notificationType);
                }
            }
        }
        else if (notificationType == 'returnAccept') {
            let stockReturnDetails = StockReturn.findOne({ _id: idVal });
            if (stockReturnDetails) {
                let userData = Meteor.users.findOne({ _id: stockReturnDetails.sdUser }, { fields: { firebaseToken: 1 } });
                if (userData.firebaseToken) {
                    console.log("MSendReturn");
                    notificationCall(userData.firebaseToken, bodyText, titleText, notificationType);
                }
            }
        }
    }
});


/**
 * For notification push
 * @param {*} user 
 * @param {*} bodyText 
 * @param {*} titleText 
 * @param {*} notificationType 
 */
function notificationCall(token, bodyText, titleText, notificationType) {
    let url = 'https://fcm.googleapis.com/fcm/send';
    let dataArray = {

        to: token,
        // to : 'ePD-zmS_S4mRWjiLNgjIX1:APA91bE8ytfaKFB3ru83eQs_yPRTZHb7zjOob3HV6IrQte-HlKnE6uv7aa8xl1LDHehGNQ93QfpI3wTfSLRZeB4XF47PU8M3npxuJk5GsWcyyKrUBVPk_tW19LL7xUojx-fa4n5rzZui',
        collapse_key: 'type_a',
        notification: {
            body: bodyText,
            title: titleText
        },
        data: {
            body: bodyText,
            title: titleText,
            notificationType: notificationType,
            click_action: "FLUTTER_NOTIFICATION_CLICK"

        }

    };
    let options = {
        data: dataArray,
        headers: {
            'Authorization': 'key=AAAAKYBSBA4:APA91bFoSQ-AmGZqzWxYdaQfC1_u4PKg5mpNtq1MCEtvB29Z-5zmx8w6mf5tumzXSy2giXzVW6hltWjNGPkdZRC_RwaxwjMivhP-lfINwwbiiENXmxv5LPRwMZRYfX04PqLljs8pS_dE',
            'content-type': 'application/json'
        }
    };
    // console.log("dataArray", dataArray);

    return HTTP.call("POST", url, options);
}