//This module exports the Squareset class and three functions:
//squareset_from_string takes in a string of 1's and 0's and returns a Squareset
//ss_and takes in several Squaresets and returns the intersection
//ss_or  takes in several Squaresets and returns the union
//A squareset is basically just a collection of bits,
//  each bit representing one square of a game board

interface ISquareset {
    get(n: number): boolean; //Gets the nth bit
    set_on(n: number): void; //Sets the nth bit on
    set_off(n: number): void; //Sets the nth bit off
    set(n: number, v: number | boolean): void; //Sets the nth bit to v (1 or 0)
    flip(n: number): void; //Flips the bit at the specified location
    count_bits(): number; //Returns the number of on bits are in the set
    get_ls1b(): number; //Retrieves the position of the least significant 1 bit
    zero(): void; //Sets every bit to 0
    is_zero(): boolean; //Returns true if every bit is 0, false otherwise
    invert(): void; //Inverts this squareset, turning 1's to 0's and 0's to 1's
    inverse(): Squareset; //Returns the inverse of this squareset
    ore(other: Squareset): void; //Sets this squareset to this or other
    ande(other: Squareset): void; //Sets this squareset to this and other
    pop(): void; //Sets the least significant 1 bit to zero
    add_rank_top(width: number, val: boolean): void;
    add_rank_bottom(width: number, val: boolean): void;
    add_file_left(width: number, val: boolean): void;
    add_file_right(width: number, val: boolean): void;
    add_at_pos(pos: number, value: boolean): void;
    push(val: boolean): void;
    delete_rank_top(width: number): void;
    delete_rank_bottom(width: number): void;
    delete_file_left(width: number): void;
    delete_file_right(width: number): void;
    remove_at_pos(pos: number): void;
    remove_at_end(): void;
}

const BITS_PER_NUMBER = 32;

export function squareset_from_string(size: number, input: string): Squareset {
    let ret = new Squareset(size);
    for (let a = 0, pos = 0; a < input.length; a++) {
        if (input[a] === "1") {
            ret.set_on(pos);
            pos++;
        } else if (input[a] === "0") {
            pos++;
        }
    }
    return ret;
}

export function ss_and(...args: Squareset[]): Squareset {
    let ret = new Squareset(args[0]);
    for (let a = 1; a < args.length; a++) {
        ret.ande(args[a]);
    }
    return ret;
}
export function ss_or(...args: Squareset[]): Squareset {
    let ret = new Squareset(args[0]);
    for (let a = 1; a < args.length; a++) {
        ret.ore(args[a]);
    }
    return ret;
}

export class Squareset implements ISquareset{
    length: number;
    backingArray: number[];

    constructor(length: number | Squareset, seed?: number) {
        if (typeof length === "object") {
            //Copy constructor
            let copy = length;
            this.length = copy.length;
            this.backingArray = Array.from(copy.backingArray);
        } else {
            if (seed === 1) {
                seed = 4294967295; //2^32-1 - 32 1's
            } else {
                seed = 0;
            }
            this.length = length;
            this.backingArray = Array.from({ length: Math.ceil(this.length / 32) }, () => seed!);
        }
    }
    set_on(n: number): void {
        this.backingArray[n / 32 | 0] |= 1 << n % 32;
    }
    set_off(n: number): void {
        this.backingArray[n / 32 | 0] &= ~(1 << n % 32);
    }
    set(n: number, v: number | boolean): void {
        if (v) { this.backingArray[n / 32 | 0] |= 1 << n % 32; }
        else { this.backingArray[n / 32 | 0] &= ~(1 << n % 32); }
    }
    flip(n: number): void {
        this.backingArray[n/32|0] ^= 1 << n % 32;
    }
    count_bits(): number {
        var count = 0;
        for (let a = 0; a < this.backingArray.length; a ++){
            let temp = this.backingArray[a];
            while(temp != 0){
                count ++;
                temp &= temp-1;
            }
        }
        return count;
    }
    get_ls1b(): number {
        for(let a = 0; a < this.length; a ++){
            if(this.get(a)){
                return a;
            }
        }
        return -1;
    }
    zero(): void {
        for (let a = 0; a < this.backingArray.length; a ++){
            this.backingArray[a] = 0;
        }
    }
    is_zero(): boolean {
        for (let a = 0; a < this.backingArray.length; a++){
            if(this.backingArray[a] != 0){
                return false;
            }
        }
        return true;
    }
    invert(): void {
        for (let a = 0; a < this.backingArray.length; a ++){
            this.backingArray[a] = ~this.backingArray[a];
        }
    }
    inverse(): Squareset {
        var ret = new Squareset(this.length);
        for (let a = 0; a < this.backingArray.length; a ++){
            ret.backingArray[a] = ~this.backingArray[a];
        }
        return ret;
    }
    ore(other: Squareset): void {
        for (let a = 0; a < this.backingArray.length; a ++){
            this.backingArray[a] |= other.backingArray[a];
        }
    }
    ande(other: Squareset): void {
        for (let a = 0; a < this.backingArray.length; a ++){
            this.backingArray[a] &= other.backingArray[a];
        }
    }
    pop(): void {
        this.set_off(this.get_ls1b());
    }
    get(n: number): boolean {
        return !!(this.backingArray[n / 32 | 0] & 1 << n % 32);
    }
    add_at_pos(pos: number, value: boolean = false) {
        //Add a new number when needed
        this.length ++;
        if (this.length > this.backingArray.length*32) {
            this.backingArray.push(0);
        }
        //Everything to the "right" of pos is shifted over
        let startShift = Math.floor(pos/32);
        let carry = (this.backingArray[startShift] & (1 << 31)) != 0;
        //Find what's static, erase it, shift everything, add back in the static
        let staticBitMask = (1 << (pos%32))-1;
        let staticAdd = this.backingArray[startShift] & staticBitMask;
        this.backingArray[startShift] &= ~staticBitMask;
        this.backingArray[startShift] <<= 1;
        this.backingArray[startShift] |= staticAdd;
        //Shift everything in subsequent numbers
        for (let a = startShift+1; a < this.backingArray.length; a ++) {
            let willCarry = (this.backingArray[a] & (1 << 31)) != 0;
            this.backingArray[a] <<= 1;
            if (carry) this.backingArray[a] |= 1;
            carry = willCarry;
        }
        //Set the bit itself
        this.set(pos, value);
    }
    push(value: boolean = false) {
        this.length ++;
        if (this.length > this.backingArray.length*32) {
            this.backingArray.push(0);
        }
        this.set(this.length-1, value);
    }
    remove_at_pos(pos: number) {
        this.set_off(pos);
        //Everything to the "right" of pos is shifted down one
        let startShift = Math.floor(pos/32);
        //Find what's static, erase it (plus deleted bit), shift everything, add it back
        let staticBitMask = (1 << (pos%32))-1;
        let staticAdd = this.backingArray[startShift] & staticBitMask;
        this.backingArray[startShift] &= ~staticBitMask;
        this.backingArray[startShift] >>>= 1;
        this.backingArray[startShift] |= staticAdd;
        //Shift down each following number
        for (let a = startShift + 1; a < this.backingArray.length; a ++) {
            if ((this.backingArray[a] & 1) != 0)
                this.backingArray[a-1] |= (1 << 31);
            this.backingArray[a] >>>= 1;
        } 
        //Remove numbers if needed
        this.length --;
        if (this.length <= (this.backingArray.length-1)*32) {
            this.backingArray.pop();
        }
    }
    remove_at_end() {
        this.set_off(this.length-1);
        this.length --;
        if (this.length <= (this.backingArray.length-1)*32) {
            this.backingArray.pop();
        }
    }
    add_rank_top(width: number, val: boolean = false): void {
        // console.log(this.backingArray);
        for (let b = 0; b < width; b ++) {
            this.add_at_pos(0, val);
        }
    }
    add_rank_bottom(width: number, val: boolean = false): void {
        for (let b = 0; b < width; b ++)
            this.push(val)
    }
    add_file_left(width: number, val: boolean = false): void {
        width ++;
        let h = Math.ceil(this.length / width);
        for (let a = 0; a < h; a ++) {
            this.add_at_pos(width*a, val);
        }
    }
    add_file_right(width: number, val: boolean = false): void {
        width ++;
        let h = Math.ceil(this.length / width);
        for (let a = 0; a < h; a ++) {
            let pos = Math.min(width*(a+1)-1, this.length+1);
            this.add_at_pos(pos, val);
        }
    }
    delete_rank_top(width: number) {
        for (let b = 0; b < width; b ++)
            this.remove_at_pos(0);
    }
    delete_rank_bottom(width: number) {
        for (let b = 0; b < width; b ++)
            this.remove_at_end();
    }
    delete_file_left(width: number) {
        width --;
        for (let b = 0; b < this.length; b += width)
            this.remove_at_pos(b)
    }
    delete_file_right(width: number) {
        width --;
        for (let b = width; b < this.length; b += width)
            this.remove_at_pos(b)
    }
}
