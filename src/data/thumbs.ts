import bankDraft from '../assets/images/bank-draft.jpg';
import billOfLading from '../assets/images/bill-of-lading.jpg';
import invoice from '../assets/images/invoice.jpg';
import bankDraft2 from '../assets/images/bank-draft-2.jpg';
import billOfLading2 from '../assets/images/bill-of-lading-2.jpg';

export interface thumbnailsProps{
    "bank-draft": string,
    "bill-of-lading": string,
    "invoice": string,
    "bank-draft-2": string,
    "bill-of-lading-2": string,
}
export const thumbnails:thumbnailsProps = {
    "bank-draft": bankDraft,
    "bill-of-lading": billOfLading,
    "invoice": invoice,
    "bank-draft-2": bankDraft2,
    "bill-of-lading-2": billOfLading2
}