import React from "react";
import ReactDOM from "react-dom";
import { ButtonToolbar, MenuItem, DropdownButton } from "react-bootstrap";
import "./index.css";
import Footer from './Footer';

function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

const Grid = props => {
  const width = props.cols * 14;
  let boxClass = "";
  const rowsArr = props.gridFull.map((rowArr, rowIdx) =>
    rowArr.map((item, colIdx) => {
      const boxId = `${rowIdx}_${colIdx}`;

      boxClass = props.gridFull[rowIdx][colIdx] ? "box on" : "box off";
      return (
        <Box
          boxClass={boxClass}
          key={boxId}
          boxId={boxId}
          row={rowIdx}
          col={colIdx}
          selectBox={props.selectBox}
        />
      );
    })
  );

  return (
    <div className="grid" style={{ width }}>
      {rowsArr}
    </div>
  );
};

class Buttons extends React.Component {
  handleSelect = eventKey => {
    this.props.gridSize(eventKey);
  };

  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <button className="btn btn-default" onClick={this.props.playButton}>
            Play
          </button>
          <button className="btn btn-default" onClick={this.props.pauseButton}>
            Pause
          </button>
          <button className="btn btn-default" onClick={this.props.restart}>
            Restart
          </button>
          <button className="btn btn-default" onClick={this.props.clear}>
            Clear
          </button>
          <button className="btn btn-default" onClick={this.props.slow}>
            Slow
          </button>
          <button className="btn btn-default" onClick={this.props.fast}>
            Fast
          </button>
          <button className="btn btn-default" onClick={this.props.seed}>
            Seed
          </button>
          <DropdownButton
            title="Grid Size"
            id="size-menu"
            onSelect={this.handleSelect}
          >
            <MenuItem eventKey="1">Small(15x15)</MenuItem>
            <MenuItem eventKey="2">Medium(30x30)</MenuItem>
            <MenuItem eventKey="3">Large(50x50)</MenuItem>
          </DropdownButton>
        </ButtonToolbar>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 30;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill()
        .map(() => Array(this.cols).fill(false))
    };
  }

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  selectBox = (row, col) => {
    const gridFull = this.state.gridFull.map((rowArr, rowIdx) =>
      rowArr.map(
        (item, colIdx) => (rowIdx === row && colIdx === col ? !item : item)
      )
    );
    this.setState(() => ({ gridFull }));
  };

  seed = () => {
    const gridFull = this.state.gridFull.map(rowArr =>
      rowArr.map(() => Math.floor(Math.random() * 4) === 1)
    );
    this.setState(() => ({ gridFull }));
  };

  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
    clearInterval(this.intervalId);
  };

  slow = () => {
    this.speed = 1000;
    this.playButton();
  };

  fast = () => {
    this.speed = 100;
    this.playButton();
  };

  restart = () => {
    this.clear();
    this.seed();
    this.playButton();
  }

  clear = () => {
    const gridFull = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill(false));

    this.setState(() => ({
      gridFull,
      generation: 0
    }));
    this.pauseButton();
  };

  gridSize = size => {
    switch (size) {
      case "1":
        this.cols = 15;
        this.rows = 15;
        break;
      case "2":
        this.cols = 30;
        this.rows = 30;
        break;
      default:
        this.cols = 50;
        this.rows = 50;
    }
    this.clear();
  };

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        for (let m = -1 ; m < 2; m++) {
          for (let n = -1; n < 2; n++) {
            if (g[(i+m+this.rows)%this.rows][(j+n+this.cols)%this.cols] === true) {
              count++;
            }
          }
        }
        if (g[i][j] === true) {
          count--;
        }





        // if (i > 0) if (g[i - 1][j]) count++;
        // if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        // if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        // if (j < this.cols - 1) if (g[i][j + 1]) count++;
        // if (j > 0) if (g[i][j - 1]) count++;
        // if (i < this.rows - 1) if (g[i + 1][j]) count++;
        // if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        // if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;




        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState(prevState => ({
      gridFull: g2,
      generation: prevState.generation + 1
    }));
  };

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          restart={this.restart}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <h3>Generations: {this.state.generation}</h3>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
