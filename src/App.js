import React, { Component } from "react";
import "./antd-mobile.min.css";

import {
  LocaleProvider,
  Tabs,
  Card,
  WhiteSpace,
  WingBlank,
  Flex,
  Badge
} from "antd-mobile";
import enUS from "antd-mobile/lib/locale-provider/en_US";
import QrReader from "react-qr-reader";

const tabs = [
  { title: "Scan QRCode" },
  { title: "Second Tab" },
  { title: "Third Tab" }
];

class App extends Component {
  state = {
    delay: 100,
    result: "No result"
  };

  handleScan = result => {
    if (result) {
      this.setState({ result });
    }
  };

  handleError = err => {
    console.error(err);
  };

  render() {
    const previewStyle = {
      backgroundColor: "black",
      height: "50vw",
      width: "50vw"
    };
    return (
      <LocaleProvider locale={enUS}>
        <div>
          <Tabs
            tabs={tabs}
            initialPage={0}
            onChange={(tab, index) => {
              console.log("onChange", index, tab);
            }}
            onTabClick={(tab, index) => {
              console.log("onTabClick", index, tab);
            }}
          >
            <div
              style={{
                height: "95vh",
                backgroundColor: "#fff"
              }}
            >
              <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                  <Card.Body>
                    <Flex justify="center">
                      <QrReader
                        delay={this.state.delay}
                        style={previewStyle}
                        onError={this.handleError}
                        onScan={this.handleScan}
                      />
                    </Flex>
                    <Flex justify="center">
                      <p>{this.state.result}</p>
                    </Flex>
                  </Card.Body>
                </Card>
                <WhiteSpace size="lg" />
              </WingBlank>
            </div>

            <div
              style={{
                height: "95vh",
                backgroundColor: "#fff"
              }}
            >
            <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                  <Card.Body>

                  </Card.Body>
                </Card>
                <WhiteSpace size="lg" />
              </WingBlank>
            </div>

            <div
              style={{
                height: "95vh",
                backgroundColor: "#fff"
              }}
            >
            <WingBlank size="lg">
                <WhiteSpace size="lg" />
                <Card>
                  <Card.Body>

                  </Card.Body>
                </Card>
                <WhiteSpace size="lg" />
              </WingBlank>
            </div>
          </Tabs>
        </div>
      </LocaleProvider>
    );
  }
}

export default App;
