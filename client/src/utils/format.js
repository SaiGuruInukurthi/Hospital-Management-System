import { format } from 'date-fns';

export const formatDate = (value) => value ? format(new Date(value), 'dd MMM yyyy') : '-';
export const formatDateTime = (value) => value ? format(new Date(value), 'dd MMM yyyy, h:mm a') : '-';
