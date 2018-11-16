import {
    message,
} from 'antd';
import {
    injectIntl,
    intlShape,
    FormattedMessage
} from 'react-intl';
export const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};


export let showRange = (min, max, unit) => {
    if (min == 0 && max == 0) {
        return "不限"
    } else if (min == 0 && max > 0) {
        return "低于" + max + " " + unit
    } else if (min > 0 && max == 0) {
        return "高于" + min + " " + unit
    } else {
        return "" + min + "~" + max + " " + unit
    }
}

export let showDate = (str) => {
    return str.split("T")[0]
}

export let showDatetime = (str) => {
    if (str.startsWith("0001")) {
        return "-"
    }
    return str.replace("T", " ").substring(0, 19)
}

export let showAvatar = (avatar) => {
    if (avatar) {
        return "/uphp/gcexserver/avatar/" + avatar
    }
    return require('@/img/user.png')
}

export let limitPrice = (price) => {
    return Math.floor(price * 100) / 100
}
export let beforeUpload = (file) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        message.error('请上传jpg或png格式图片', 2);
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片必须小于2MB', 2);

        return false;
    }
    return true;
}
export let limitAmount = (amount) => {
    return Math.floor(amount * 1000000) / 1000000
}


export let showTradeStatus = (status, appeal) => {
    switch (appeal) {
        case 1:
        case "1":
            return "买家申诉中";
        case 2:
        case "2":
            return "卖家申诉中";
    }
    switch (status) {
        case 0:
        case "0":
            return "待接受";
        case 1:
        case "1":
            return "已注资，待付款";
        case 2:
        case "2":
            return "已付款，待放行";
        case 3:
        case "3":
            return "完成";
        case 4:
        case "4":
            return "取消";
        case 5:
        case "5":
        case 7:
        case "7":
            return "自动取消";
        case 6:
        case "6":
            return "拒绝";
    }
}

export let showPaymentMethods = {
    "ALIPAY": "支付宝",
    "NATIONAL_BANK": "银行转账",
    "WECHAT": "微信支付",
}

export let showCountry = {
    "CN": "中国",
    "HK": "香港",
    "JN": "印度",
    "JP": "日本",
    "US": "美国",
    "AU": "澳大利亚",
}
export let isValidFloat = (str) => {
    return /^[0-9.]+$/.test(str);
}
export let codeTest = (props, code) => {
    switch (code) {
        case 100200:
            message.success(props.intl.formatMessage({
                id: "100200"
            }))
            break;
        case 100100:
            message.error(props.intl.formatMessage({
                id: "100100"
            }))
            break;
        case 100101:
            message.error(props.intl.formatMessage({
                id: "100101"
            }))
            break;
        case 100102:
            message.error(props.intl.formatMessage({
                id: "100102"
            }))
            break;
        case 100103:
            message.error(props.intl.formatMessage({
                id: "100103"
            }))
            break;
        case 100104:
            message.error(props.intl.formatMessage({
                id: "100104"
            }))
            break;
        case 100105:
            message.error(props.intl.formatMessage({
                id: "100105"
            }))
            break;
        case 100106:
            message.error(props.intl.formatMessage({
                id: "100106"
            }))
            break;
        case 100107:
            message.error(props.intl.formatMessage({
                id: "100107"
            }))
            break;
        case 100108:
            message.error(props.intl.formatMessage({
                id: "100108"
            }))
            break;
        case 100109:
            message.error(props.intl.formatMessage({
                id: "100109"
            }))
            break;
        case 100110:
            message.error(props.intl.formatMessage({
                id: "100110"
            }))
            break;
        case 100111:
            message.error(props.intl.formatMessage({
                id: "100111"
            }))
            break;
        case 100112:
            message.error(props.intl.formatMessage({
                id: "100112"
            }))
            break;
        case 100113:
            message.error(props.intl.formatMessage({
                id: "100113"
            }))
            break;
        case 100301:
            message.error(props.intl.formatMessage({
                id: "100301"
            }))
            break;
        case 100302:
            message.error(props.intl.formatMessage({
                id: "100302"
            }))
            break;
        case 100303:
            message.error(props.intl.formatMessage({
                id: "100303"
            }))
            break;
        case 100304:
            message.error(props.intl.formatMessage({
                id: "100304"
            }))
            break;
        case 100305:
            message.error(props.intl.formatMessage({
                id: "100305"
            }))
            break;
        case 100306:
            message.error(props.intl.formatMessage({
                id: "100306"
            }))
            break;
        case 100307:
            message.error(props.intl.formatMessage({
                id: "100307"
            }))
            break;
        case 100308:
            message.error(props.intl.formatMessage({
                id: "100308"
            }))
            break;
        case 100309:
            message.error(props.intl.formatMessage({
                id: "100309"
            }))
            break;
        case 100310:
            message.error(props.intl.formatMessage({
                id: "100310"
            }))
            break;
        case 100311:
            message.error(props.intl.formatMessage({
                id: "100311"
            }))
            break;
        case 100312:
            message.error(props.intl.formatMessage({
                id: "100312"
            }))
            break;
        case 100313:
            message.error(props.intl.formatMessage({
                id: "100313"
            }))
            break;
        case 100314:
            message.error(props.intl.formatMessage({
                id: "100314"
            }))
            break;
        case 100315:
            message.error(props.intl.formatMessage({
                id: "100315"
            }))
            break;
        case 100316:
            message.error(props.intl.formatMessage({
                id: "100316"
            }))
            break;
        case 100317:
            message.error(props.intl.formatMessage({
                id: "100317"
            }))
            break;
        case 100318:
            message.error(props.intl.formatMessage({
                id: "100318"
            }))
            break;
        case 100319:
            message.error(props.intl.formatMessage({
                id: "100319"
            }))
            break;
        case 100320:
            message.error(props.intl.formatMessage({
                id: "100320"
            }))
            break;
        case 100321:
            message.error(props.intl.formatMessage({
                id: "100321"
            }))
            break;
        case 100401:
            message.error(props.intl.formatMessage({
                id: "100401"
            }))
            break;
        case 100402:
            message.error(props.intl.formatMessage({
                id: "100402"
            }))
            break;
        case 100403:
            message.error(props.intl.formatMessage({
                id: "100403"
            }))
            break;
        case 100404:
            message.error(props.intl.formatMessage({
                id: "100404"
            }))
            break;
        case 100405:
            message.error(props.intl.formatMessage({
                id: "100405"
            }))
            break;
        case 100406:
            message.error(props.intl.formatMessage({
                id: "100406"
            }))
            break;
        case 100407:
            message.error(props.intl.formatMessage({
                id: "100407"
            }))
            break;
        case 100408:
            message.error(props.intl.formatMessage({
                id: "100408"
            }))
            break;
        case 100409:
            message.error(props.intl.formatMessage({
                id: "100409"
            }))
            break;
        case 100410:
            message.error(props.intl.formatMessage({
                id: "100410"
            }))
            break;
        case 100411:
            message.error(props.intl.formatMessage({
                id: "100411"
            }))
            break;
        case 900001:
            message.error(props.intl.formatMessage({
                id: "900001"
            }))
            break;
        case 999999:
            message.error(props.intl.formatMessage({
                id: "999999"
            }))
            break;
    }
}