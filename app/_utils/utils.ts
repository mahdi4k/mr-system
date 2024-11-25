"use client"

import { IStatusFetch } from '@/_redux/features/ads';
import moment from 'moment-jalaali';
moment.locale('fa'); // Persian/Farsi locale
moment.loadPersian({ dialect: 'persian-modern' }); // This is for Persian digits and formatting

export const formatJalaliTimeAgo = (date: string) => {
    const now = moment();
    const past = moment(date);

    const duration = moment.duration(now.diff(past));
    const seconds = duration.asSeconds();

    if (seconds < 60) return 'چند لحظه پیش';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} دقیقه پیش`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ساعت پیش`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} روز پیش`;
    if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} ماه پیش`;

    return `${Math.floor(seconds / 31536000)} سال پیش`;
};

export const toFormData = (object: any) => Object.keys(object).reduce((formData, key) => {
    if (object[key] !== undefined && object[key] !== null && object[key] !== '') {
        formData.append(key, object[key])
    }
    return formData
}, new FormData())

export async function dataURItoBlob(dataURI: string | undefined) {
    if (!dataURI) return undefined
    const blob = await (await fetch(dataURI)).blob()
    return new File([blob], 'logo.png', { type: "image/png" })
}

export function ObjectIsEmpty(obj: Object) {
    return obj === undefined || Object.keys(obj).length === 0;
}

export function persianToWesternNumerals(persianNum: string) {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const arabicDigits = '0123456789';
    return persianNum.replace(/[۰-۹]/g, (char) => arabicDigits[persianDigits.indexOf(char)]);
}


export const formatNumber = (num: string) => {
    return num.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


const persianNumbers = [
    "", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه", "ده",
    "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده",
    "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"
];

const persianHundreds = [
    "", "یکصد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"
];

const persianThousands = [
    "", "هزار", "میلیون", "میلیارد"
];

export function convertNumberToWords(number: number) {
    if (isNaN(number)) return '';

    if (number === 0) return 'صفر';

    let words = '';
    let thousandIndex = 0;

    while (number > 0) {
        const n = number % 1000;
        if (n !== 0) {
            const word = convertThreeDigitNumberToWords(n);
            if (thousandIndex > 0 && word !== '') {
                words = word + ' ' + persianThousands[thousandIndex] + ' و ' + words;
            } else {
                words = word + ' ' + persianThousands[thousandIndex] + ' ' + words;
            }
        }
        number = Math.floor(number / 1000);
        thousandIndex++;
    }

    return words.trim().replace(/ و $/, '');
}

function convertThreeDigitNumberToWords(number: number) {
    let words = '';

    const hundreds = Math.floor(number / 100);
    const remainder = number % 100;

    if (hundreds > 0) {
        words += persianHundreds[hundreds] + ' و ';
    }

    if (remainder > 0) {
        if (remainder < 20) {
            words += persianNumbers[remainder];
        } else {
            const tens = Math.floor(remainder / 10);
            const ones = remainder % 10;
            words += persianNumbers[18 + tens]; // Adjust for tens mapping
            if (ones > 0) {
                words += ' و ' + persianNumbers[ones];
            }
        }
    }

    return words.trim();
}

export const provinceTitleHandler = (status: IStatusFetch, item: string, ostan: { id: number, name: string }[]) => {
    if (status === 'succeeded') {
        const province = ostan.find(province => province.id == Number(item))
        return province?.name
    }
    return ''
}
export const cityTitleHandler = (status: IStatusFetch, item: string, cities: { id: number, name: string }[]) => {
    if (status === 'succeeded') {
        const city = cities.find(city => city.id == Number(item))
        return city?.name
    }
    return ''
}

export const convertToEnglishNumber = (value: string): string => {
    // Persian/Arabic digits mapping
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    return value
        .replace(/[۰-۹]/g, (char) => persianNumbers.indexOf(char).toString())
        .replace(/[٠-٩]/g, (char) => arabicNumbers.indexOf(char).toString());
};

export const formatNumberWithCommas = (value: string): string => {
    // Ensure the value only has numbers before formatting
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const currentUrlCategory = (item: string): string => {
    if (typeof window === 'undefined') {
        // Return a fallback value or handle the case where window is not available
        return '';
    }

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('category', item.replace(/,/g, ''));
    return `${window.location.pathname}?${searchParams.toString()}`;

}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

