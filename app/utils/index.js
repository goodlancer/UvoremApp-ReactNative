import { Platform, Animated, Easing, UIManager, LayoutAnimation, PixelRatio, Dimensions, I18nManager } from "react-native";
import memoize from "lodash.memoize";
import * as RNLocalize from "react-native-localize";
import i18n from "i18n-js";
import Moment from 'moment';

const scaleValue = PixelRatio.get() / 2;
export const SERVER_HOST = "http://35.193.72.187";
// export const SERVER_HOST = "http://192.168.109.67";
export const EMAIL_VALIDATE = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export const CHAT_TYPE = {
  GENERAL: 'General',
  TEAM: 'Team',
  ADS: 'Ads',
  PRIVATE: 'Private',
  MATCHES: 'Matches',
}
export const MSG_SHOW_COUNT = 10;
export const CHECK_ROLE_TYPE = {
  NEWS_CLUB: 0,
  NEWS_PARTNER: 1,
  NEWS_OTHER: 2,
  MATCH: 3,
}
export const SUBSCRIPTION_TYPE = {
  DONATION_WITHOUT_SIGN: 0,
  DONATION: 1,
  SUBSCRIPTION_LOGIN: 2,
  SUBSCRIPTION_SERVICE: 3,
  BUY_PRODUCT_SHOP: 4
}

export const date2str = (date, format) => {
  if(!date) return '';
  if (!format) format = 'D MMM HH:mm';
  return Moment(date).format(format);
}
export const convertMinsToTime = (mins) => {
  let hours = Math.floor(mins / 60);
  let minutes = mins % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}.${minutes}`;
}
export const isObjEmpty = (obj) => {
  if (obj == null) return true;
  if (obj === null) return true;
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;
  if (typeof obj !== "object") return true;
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}
export const enableExperimental = () => {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};
export const scaleWithPixel = (size, limitScale = 1.2) => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
};
export const heightHeader = () => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const landscape = width > height;

  if (Platform.OS === "android") return 40;
  if (Platform.isPad) return 40;
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      return landscape ? 30 : 40;
    default:
      return landscape ? 30 : 40;
  }
};
export const heightTabView = () => {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;
  let size = height - heightHeader();
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      size -= 30;
      break;
    default:
      break;
  }

  return size;
};
export const getWidthDevice = () => {
  return Dimensions.get("window").width;
};
export const getHeightDevice = () => {
  return Dimensions.get("window").height;
};

export const getIconSize = () => {
  const screen_width = getWidthDevice();
  if (screen_width < 800) return 24;
  else if (screen_width < 1280) return 28;
  else if (screen_width < 1920) return 32;
  return 36;
}
export const scrollEnabled = (contentWidth, contentHeight) => {
  return contentHeight > Dimensions.get("window").height - heightHeader();
};
// Animation navigation between screen react-navigation
export function fromLeft(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initWidth, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  };
}
/**
 * @description Transition animation screen expand from on the top of screen
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function fromTop(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initHeight } = layout;

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-initHeight, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  };
}
/**
 * @description Transition animation screen expand from on the right to left
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function fromRight(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initWidth } = layout;

      const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initWidth, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateX }] };
    }
  };
}
/**
 * @description Transition animation screen expand from on the bottom to top
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function fromBottom(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ layout, position, scene }) => {
      const { index } = scene;
      const { initHeight } = layout;

      const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [initHeight, 0, 0]
      });

      const opacity = position.interpolate({
        inputRange: [index - 1, index - 0.99, index],
        outputRange: [0, 1, 1]
      });

      return { opacity, transform: [{ translateY }] };
    }
  };
}
/**
 * @description Transition animation fadeIn
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function fadeIn(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1]
      });

      return { opacity };
    }
  };
}
/**
 * @description Transition animation zoomIn
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function zoomIn(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;
      let start = 0;

      if (Platform.OS !== "ios") {
        start = 0.005;
      }

      const scale = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [start, 1]
      });

      return { transform: [{ scale }] };
    }
  };
}
/** 
 * @description Transition animation zoomOut
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function zoomOut(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;

      const scale = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [10, 1]
      });

      return { transform: [{ scale }] };
    }
  };
}
/**
 * @description Animation effect flip with vertical
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function flipY(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;

      const rotateY = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: ["180deg", "0deg"]
      });

      return { transform: [{ rotateY }], backfaceVisibility: "hidden" };
    }
  };
}
/**
 * @description Animation effect flip with horizontal
 * @author Passion UI <passionui.com>
 * @date 2019-08-03
 * @export
 * @param {number} [duration=300]
 * @returns
 */
export function flipX(duration = 300) {
  return {
    transitionSpec: {
      duration,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true
    },
    screenInterpolator: ({ position, scene }) => {
      const { index } = scene;

      const rotateX = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: ["180deg", "0deg"]
      });

      return { transform: [{ rotateX }], backfaceVisibility: "hidden" };
    }
  };
}
export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key)
);


export const getCurLan = () => { return i18n.locale };

export const getCreditCardToken = (creditCardData, PUBLISHABLE_KEY) => {
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc
  };
  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${PUBLISHABLE_KEY}`
    },
    method: 'post',
    body: Object.keys(card)
      .map(key => key + '=' + card[key])
      .join('&')
  }).then(response => response.json());
};

export const getTime = (minnutes) => {
  let min = parseInt(minnutes);
  let min_sec = parseFloat(`0.${String(minnutes).split(".")[1]}`);
  let time = ``;
  if (min > 0)
    time += `${min} ${translate("tatic.time")} `;
  if (min_sec > 0 && min_sec < 1)
    time += `${parseInt(min_sec * 60)} ${translate("tatic.second")}`;

  return time;
}