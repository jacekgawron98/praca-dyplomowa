export function padding(top: number, left?: number, bottom?: number, right?: number) {
    return { 
        paddingTop: top,
        paddingBottom: bottom !== undefined? bottom : top,
        paddingLeft: left !== undefined? left : top,
        paddingRight: right !== undefined? right : left !== undefined? left : top
    }
}

export function margin(top: number, left?: number, bottom?: number, right?: number) {
    return { 
        marginTop: top,
        marginBottom: bottom !== undefined? bottom : top,
        marginLeft: left? left : left,
        marginRight: right !== undefined? right : left !== undefined? left : top
    }
}