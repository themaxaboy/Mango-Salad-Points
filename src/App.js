import React, { Component } from "react";
import database from "./database";
import QrReader from "react-qr-reader";
import md5 from "blueimp-md5";
import {
  Button,
  Segment,
  Divider,
  Container,
  Statistic,
  Message,
  Step,
  Input,
  Header,
  Icon,
  Modal
} from "semantic-ui-react";

class App extends Component {
  state = {
    delay: 100,
    result: "-",
    point: 0,
    input: "",
    scan: false,
    step: 0,
    mode: "+",
    modalMessage: "",
    modalOpen: false
  };

  readDatabase = () => {
    database
      .database()
      .ref(this.state.result)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          this.setState({ point: snapshot.val() });
        } else {
          this.setState({ point: 0 });
        }
      });
  };

  writeDatabase = () => {
    let value;

    this.state.mode.toString() === "+"
      ? (value =
          parseInt(this.state.point, 10) + parseInt(this.state.input, 10))
      : (value =
          parseInt(this.state.point, 10) - parseInt(this.state.input, 10));

    database
      .database()
      .ref(this.state.result)
      .set(value);

    this.setState({ point: value });
  };

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  validateValue = () => {
    if (parseInt(this.state.input, 10) > parseInt(this.state.point, 10)) {
      this.setState({
        modalMessage:
          "Something went wrong. The input value is greater than points remaining."
      });
      this.handleOpen();
      return false;
    } else {
      return true;
    }
  };

  handleScan = result => {
    if (result) {
      result = md5(result);
      this.setState({ result, scan: false, step: 1 }, () =>
        this.readDatabase()
      );
    }
  };

  handleError = err => {
    console.error(err);
  };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <Container textAlign="center">
          {
            {
              0: (
                <Step.Group ordered>
                  <Step title="Scan" description="Scan QRCode" />

                  <Step
                    active
                    title="Add/Use Point"
                    description="Enter billing information"
                  />

                  <Step
                    active
                    title="Confirm Order"
                    description="Summit order."
                  />
                </Step.Group>
              ),
              1: (
                <Step.Group ordered>
                  <Step completed title="Scan" description="Scan QRCode" />

                  <Step
                    title="Add/Use Point"
                    description="Enter billing information"
                  />

                  <Step
                    active
                    title="Confirm Order"
                    description="Summit order."
                  />
                </Step.Group>
              ),
              2: (
                <Step.Group ordered>
                  <Step completed title="Scan" description="Scan QRCode" />

                  <Step
                    completed
                    title="Add/Use Point"
                    description="Enter billing information"
                  />

                  <Step title="Confirm Order" description="Summit order." />
                </Step.Group>
              ),
              3: (
                <Step.Group ordered>
                  <Step completed title="Scan" description="Scan QRCode" />

                  <Step
                    completed
                    title="Add/Use Point"
                    description="Enter billing information"
                  />

                  <Step
                    completed
                    title="Confirm Order"
                    description="Summit order."
                  />
                </Step.Group>
              )
            }[this.state.step]
          }
        </Container>

        <Segment padded>
          {this.state.scan ? (
            <Container
              textAlign="center"
              style={{
                textAlign: "center",
                backgroundColor: "black",
                height: "50vh",
                width: "50vw"
              }}
            >
              <QrReader
                style={{
                  textAlign: "center",
                  height: "50vh",
                  width: "50vw"
                }}
                delay={this.state.delay}
                onError={this.handleError}
                onScan={this.handleScan}
              />
            </Container>
          ) : (
            <Container textAlign="center">
              <Button
                style={{
                  height: "50vh",
                  width: "50vw"
                }}
                size="big"
                onClick={() => this.setState({ scan: true, step: 0 })}
              >
                Click to Scan QRCode
              </Button>
            </Container>
          )}

          <Divider section />

          <Container textAlign="center">
            <Message color="blue">
              <Statistic size="mini" color="blue">
                <Statistic.Label>ID</Statistic.Label>
                <Statistic.Value>{this.state.result}</Statistic.Value>
              </Statistic>
            </Message>

            <Message color="green">
              <Statistic size="tiny" color="green">
                <Statistic.Label>Point</Statistic.Label>
                <Statistic.Value>{this.state.point}</Statistic.Value>
              </Statistic>
            </Message>

            <Message>
              <Container textAlign="center">
                {
                  {
                    0: (
                      <Input
                        disabled
                        icon="shopping basket"
                        placeholder="Point"
                      />
                    ),
                    1: (
                      <Input
                        value={this.state.input}
                        type="tel"
                        onChange={event =>
                          this.setState({
                            input: event.target.value.replace(/[^\d]/g, "")
                          })}
                        icon="shopping basket"
                        placeholder="Point"
                      />
                    ),
                    2: (
                      <div>
                        {this.state.mode.toString() === "+" ? (
                          <Statistic
                            horizontal
                            size="tiny"
                            color="green"
                            value={"+" + this.state.input}
                            label="Point."
                          />
                        ) : (
                          <Statistic
                            horizontal
                            size="tiny"
                            color="red"
                            value={"-" + this.state.input}
                            label="Point."
                          />
                        )}
                      </div>
                    ),
                    3: (
                      <Header size="large" color="green">
                        Update success!
                      </Header>
                    )
                  }[this.state.step]
                }
              </Container>
            </Message>
          </Container>

          <Divider hidden />

          <Container textAlign="center">
            {
              {
                0: (
                  <Button.Group>
                    <Button disabled size="big" positive>
                      Add Point
                    </Button>

                    <Button.Or />

                    <Button disabled size="big" negative>
                      Use Point
                    </Button>
                  </Button.Group>
                ),
                1: (
                  <Button.Group>
                    <Button
                      onClick={() => {
                        if (this.state.input) {
                          this.setState({ step: 2, mode: "+" });
                        } else {
                          this.setState({
                            modalMessage:
                              "Something went wrong. The input value is undefined."
                          });
                          this.handleOpen();
                        }
                      }}
                      size="big"
                      positive
                    >
                      Add Point
                    </Button>

                    <Button.Or />

                    <Button
                      onClick={() => {
                        if (this.state.input) {
                          if (this.validateValue()) {
                            this.setState({ step: 2, mode: "-" });
                          } else {
                            return;
                          }
                        } else {
                          this.setState({
                            modalMessage:
                              "Something went wrong. The input value is undefined."
                          });
                          this.handleOpen();
                        }
                      }}
                      size="big"
                      negative
                    >
                      Use Point
                    </Button>
                  </Button.Group>
                ),
                2: (
                  <Button.Group>
                    <Button
                      onClick={() => {
                        this.writeDatabase();
                        this.setState({ step: 3 }, () =>
                          setTimeout(() => {
                            this.setState({
                              step: 0,
                              result: "-",
                              point: 0,
                              input: ""
                            });
                          }, 3000)
                        );
                      }}
                      size="big"
                      positive
                    >
                      Confirm
                    </Button>

                    <Button.Or />

                    <Button
                      onClick={() => this.setState({ step: 1, input: "" })}
                      size="big"
                      negative
                    >
                      Cancel
                    </Button>
                  </Button.Group>
                ),
                3: (
                  <Button.Group>
                    <Button disabled size="big" positive>
                      Confirm
                    </Button>

                    <Button.Or />

                    <Button disabled size="big" negative>
                      Cancel
                    </Button>
                  </Button.Group>
                )
              }[this.state.step]
            }
          </Container>
        </Segment>
        <Modal
          open={this.state.modalOpen}
          onClose={this.handleClose}
          basic
          size="small"
        >
          <Header icon="exclamation" content="Error!" />
          <Modal.Content>
            <h3>{this.state.modalMessage}</h3>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.handleClose} inverted>
              <Icon name="close" /> Close
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default App;
