export function padding(top: number, bottom?: number, left?: number, right?: number) {
    return { 
        paddingTop: top,
        paddingBottom: bottom? bottom : top,
        paddingLeft: left? left : left,
        paddingRight: right? right : right
    }
}

export function margin(top: number, bottom?: number, left?: number, right?: number) {
    return { 
        marginTop: top,
        marginBottom: bottom? bottom : top,
        marginLeft: left? left : left,
        marginRight: right? right : right
    }
}