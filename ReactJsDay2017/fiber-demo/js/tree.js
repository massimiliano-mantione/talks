var dotStyle = {
    position: 'absolute',
    background: '#61dafb',
    font: 'normal 15px sans-serif',
    textAlign: 'center',
    cursor: 'pointer',
};

var containerStyle = {
    position: 'absolute',
    transformOrigin: '0 0',
    left: '50%',
    top: '50%',
    width: '10px',
    height: '10px',
    background: '#eee',
};

var targetSize = 25;

class Dot extends React.Component {
    constructor() {
        super();
        this.state = { hover: false };
    }
    enter() {
        this.setState({
        hover: true
        });
    }
    leave() {
        this.setState({
        hover: false
        });
    }
    render() {
        var props = this.props;
        var s = props.size * 1.3;
        var style = {
        ...dotStyle,
        width: s + 'px',
        height: s + 'px',
        left: (props.x) + 'px',
        top: (props.y) + 'px',
        borderRadius: (s / 2) + 'px',
        lineHeight: (s) + 'px',
        background: this.state.hover ? '#ff0' : dotStyle.background
        };
        return (
        <div style={style} onMouseEnter={() => this.enter()} onMouseLeave={() => this.leave()}>
            {this.state.hover ? '*' + props.text + '*' : props.text}
        </div>
        );
    }
}

function SierpinskiTriangle({ key, x, y, s, children }) {
    if (s <= targetSize) {
        return (
        <Dot
            x={x - (targetSize / 2)}
            y={y - (targetSize / 2)}
            size={targetSize}
            text={children}
        />
        );
        return r;
    }
    var newSize = s / 2;
    var slowDown = true;
    if (slowDown) {
        var e = performance.now() + 0.8;
        while (performance.now() < e) {
        // Artificially long execution time.
        }
    }

    s /= 2;

    return (
        <div key={key}>
        <SierpinskiTriangle key='a' x={x} y={y - (s / 2)} s={s}>
            {children}
        </SierpinskiTriangle>
        <SierpinskiTriangle key='b' x={x - s} y={y + (s / 2)} s={s}>
            {children}
        </SierpinskiTriangle>
        <SierpinskiTriangle key='c' x={x + s} y={y + (s / 2)} s={s}>
            {children}
        </SierpinskiTriangle>
        </div>
    );
}
SierpinskiTriangle.shouldComponentUpdate = function(oldProps, newProps) {
    var o = oldProps;
    var n = newProps;
    return !(
        o.x === n.x &&
        o.y === n.y &&
        o.s === n.s &&
        o.children === n.children
    );
};

class ExampleApplication extends React.Component {
    constructor() {
        super();
        this.state = { seconds: 0 };
        this.tick = this.tick.bind(this);
    }
    componentDidMount() {

        console.log("componentDidMount")

        this.intervalID = setInterval(this.tick, 1000);
    }
    tick() {
        if (typeof(ReactDOM.unstable_deferredUpdates) == 'function') {
            ReactDOM.unstable_deferredUpdates(() =>
                this.setState(state => ({ seconds: (state.seconds % 10) + 1 }))
            );
        } else {
            this.setState(state => ({ seconds: (state.seconds % 10) + 1 }))
        }
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    render() {
        const seconds = this.state.seconds;
        const elapsed = this.props.elapsed;
        const t = (elapsed / 1000) % 10;
        const scale = 1 + (t > 5 ? 10 - t : t) / 10;
        const transform = 'scaleX(' + (scale / 2.1) + ') scaleY(0.7) translateZ(0.1px)';
        return (
        <div style={{ ...containerStyle, transform }}>
            <div>
                <SierpinskiTriangle x={0} y={0} s={1000}>
                    {this.state.seconds}
                </SierpinskiTriangle>
            </div>
        </div>
        );
    }
}

var start = new Date().getTime();
function update() {
    ReactDOM.render(
        <ExampleApplication elapsed={new Date().getTime() - start} />,
        document.getElementById('root')
    );
    requestAnimationFrame(update);
}
requestAnimationFrame(update);
