import { AdMobRewarded } from 'react-native-admob'
import { Platform } from 'react-native';

export const getIntertial = () => {

    AdMobRewarded.setTestDevices([AdMobRewarded.simulatorId]);
    AdMobRewarded.setAdUnitID('ca-app-pub-5889275287697304/1658933582');
    // AdMobRewarded.setAdUnitID('ca-app-pub-5889275287697304/9842861152');
    // AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/1033173712');

    AdMobRewarded.addEventListener('adLoaded', () =>
        console.log('AdMobInterstitial adLoaded'),
    );
    AdMobRewarded.addEventListener('adFailedToLoad', error =>
        console.warn(error),
    );
    AdMobRewarded.addEventListener('adOpened', () =>
        console.log('AdMobInterstitial => adOpened'),
    );
    AdMobRewarded.addEventListener('adClosed', () => {
        console.log('AdMobInterstitial => adClosed');
        AdMobRewarded.requestAd().catch(error => console.warn(error));
    });
    AdMobRewarded.addEventListener('adLeftApplication', () =>
        console.log('AdMobInterstitial => adLeftApplication'),
    );

    AdMobRewarded.requestAd().catch(error => console.warn(error));
}
