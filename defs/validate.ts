export const MAX_AUTHOR_LEN = 64;
export const MAX_TEXT_LEN = 4096;

export function validate(author: string, text: string) {
    if (author.length > MAX_AUTHOR_LEN) {
        return 'author name too long';
    } else if (author.replace(/\s/g, '').length === 0) {
        return 'empty author name';
    } else if (author.search('\n') !== -1) {
        return 'author name contains newline';
    } else if (text.length > MAX_TEXT_LEN) {
       return 'too long';
    } else if (text.split('\n').length > 100) {
        return 'too many newlines';
    } else if (text.replace(/\s/g, '').length === 0) {
        return 'empty reply';
    } else {
        return undefined;
    }
}