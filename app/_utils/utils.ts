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