import { formatInTimeZone } from 'date-fns-tz';

const timezone = "Asia/Kolkata"

export const getConvertedTime = (date) => {
    return (
        formatInTimeZone(date, timezone, " HH:mm , dd/MM/yyyy")
    )
}

