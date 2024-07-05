import { Component } from "react";
import React from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const BACKEND_URL = "http://localhost:8000/api/board/";

interface IProps {
    isModifyMode: boolean;
    boardId: number;
    handleCancel: any;
}

/**
 * Write class
 * @param {SS} e
 */
class Write extends Component<IProps> {
    /**
     * @param {SS} props
     */
    constructor(props: any) {
        super(props);
        this.state = {
            title: "",
            content: "",
            isRendered: false,
        };
    }

    state = {
        title: "",
        content: "",
        isRendered: false,
    };

    write = () => {
        Axios.post(BACKEND_URL, {
            title: this.state.title,
            content: this.state.content,
        })
            .then(() => {
                this.setState({
                    title: "",
                    content: "",
                });
                this.props.handleCancel();
            })
            .catch((e) => {
                console.error(e);
            });
    };

    update = () => {
        Axios.put(BACKEND_URL + this.props.boardId + '/', {
            title: this.state.title,
            content: this.state.content,
            id: this.props.boardId,
        })
            .then(() => {
                this.setState({
                    title: "",
                    content: "",
                });
                this.props.handleCancel();
            })
            .catch((e) => {
                console.error(e);
            });
    };

    detail = () => {
        Axios.get(BACKEND_URL + this.props.boardId + '/')
            .then((res) => {
                if (res.data.length > 0) {
                    this.setState({
                        title: res.data[0].BOARD_TITLE,
                        content: res.data[0].BOARD_CONTENT,
                    });
                }
            })
            .catch((e) => {
                console.error(e);
            });
    };

    handleChange = (e: any) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    /**
     *
     * @param {any} prevProps
     */
    componentDidUpdate = (prevProps: any) => {
        if (this.props.isModifyMode && this.props.boardId != prevProps.boardId) {
            this.detail();
        }
    };

    /**
     * @return {Component} Component
     */
    render() {
        return (
            <div>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleChange}
                            placeholder="제목을 입력하세요"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="content"
                            value={this.state.content}
                            onChange={this.handleChange}
                            placeholder="내용을 입력하세요"
                        />
                    </Form.Group>
                </Form>
                <Button variant="info" onClick={this.props.isModifyMode ? this.update : this.write}>
                    작성완료
                </Button>
                <Button variant="secondary" onClick={this.props.handleCancel}>
                    취소
                </Button>
            </div>
        );
    }
}

export default Write;
