import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import { ChromePicker } from "react-color";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles/ColorPickerFormStyles';


class ColorPickerForm extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            currentColor: "teal",
            newColorName: "",
        }
        this.updateCurrentColor = this.updateCurrentColor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        ValidatorForm.addValidationRule('isColorNameUnique', (value) => 
          this.props.colors.every(
            ({ name }) => name.toLowerCase() !== value.toLowerCase()
          )
        );
        ValidatorForm.addValidationRule('isColorUnique', (value) =>
          this.props.colors.every(
            ({ color }) => color !== this.state.currentColor
          )
        );
    };
    updateCurrentColor(newColor) {
        this.setState({currentColor: newColor.hex})
    };
    handleChange(evt) {
        this.setState({
              [evt.target.name]: evt.target.value
            })
    };
    handleSubmit() {
        const newColor = {
            color: this.state.currentColor,
            name: this.state.newColorName
        };
        this.props.addNewColor(newColor);
        this.setState({newColorName: ""})
    };
    render() {
        const { paletteIsFull, classes } = this.props;
        const { currentColor, newColorName } = this.state;
        return (
            <div>
                <ChromePicker
                        color={currentColor}
                        onChangeComplete={this.updateCurrentColor}
                        className={classes.picker}
              />
              <ValidatorForm
                onSubmit={this.handleSubmit}
                ref='form'
                instantValidate={false}
              >
                <TextValidator 
                  value={newColorName}
                  name="newColorName"
                  variant="filled"
                  placeholder="Color Name"
                  margin='normal'
                  className={classes.colorNameInput}
                  onChange={this.handleChange}
                  validators={["required",
                    "isColorNameUnique",
                    "isColorUnique"]}
                  errorMessages={["Enter a color name", "That color name is already taken!", "You already used that color!"]}
                />
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  className={classes.addColor}
                  style={{
                    backgroundColor:
                        paletteIsFull
                        ? "grey"
                        : currentColor
                  }}
                  disabled={paletteIsFull}
                >
                  {paletteIsFull ? "Palette Full" : "Add Color"}
                </Button>
              </ValidatorForm>
            </div>
        )
    }
}

export default withStyles(styles)(ColorPickerForm);
