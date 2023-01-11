function DieFace({ color, numColor, displayNumber }) {
    return <div
        className={"die-face"}
        style={{
            background: color,
            color: numColor
        }}
    >
        {displayNumber}
    </div>
}

export default DieFace;