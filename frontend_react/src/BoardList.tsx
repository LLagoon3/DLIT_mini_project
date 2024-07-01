import { Component } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

const Board = ({
    id,
    title,
    registerId,
    registerDate,
    props,
}: {
    id: number;
    title: string;
    registerId: string;
    registerDate: string;
    props: any;
}) => {
    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    value={id}
                    onChange={(e) => {
                        props.onCheckboxChange(e.currentTarget.checked, e.currentTarget.value);
                    }}
                ></input>
            </td>
            <td>{id}</td>
            <td>{title}</td>
            <td>{registerId}</td>
            <td>{registerDate}</td>
        </tr>
    );
};

interface IProps {
    isComplete: boolean;
    handleModify: any;
    renderComplete: any;
}

/**
 * BoardList class
 * @param {SS} e
 */
class BoardList extends Component<IProps> {
    /**
     * @param {SS} props
     */
    constructor(props: any) {
        super(props);
        this.state = {
            boardList: [],
            checkList: [],
        };
    }

    state = {
        boardList: [],
        checkList: [],
    };

    getList = () => {
        Axios.get("http://localhost:8000/api/board/")
            .then((res) => {
                const { data } = res;
                this.setState({
                    boardList: data,
                });
                this.props.renderComplete();
            })
            .catch((e) => {
                console.error(e);
            });
    };

    /**
     * @param {boolean} checked
     * @param {any} id
     */
    onCheckboxChange = (checked: boolean, id: any) => {
        const list: Array<string> = this.state.checkList.filter((v) => {
            return v != id;
        });

        if (checked) {
            list.push(id);
        }

        this.setState({
            checkList: list,
        });
    };

    /**
     */
    componentDidMount() {
        this.getList();
    }

    /**
     */
    componentDidUpdate() {
        if (!this.props.isComplete) {
            this.getList();
        }
    }
    // handleDelete = () => {
    //     if (this.state.checkList.length == 0) {
    //         alert("삭제할 게시글을 선택하세요.");
    //         return;
    //     }
    
    //     let boardIdList = "";
    
    //     this.state.checkList.forEach((v: any) => {
    //         boardIdList += `'${v}',`;
    //     });
    
    //     Axios.delete(`http://localhost:8000/api/board/1/`, {
    //         boardIdList: boardIdList.substring(0, boardIdList.length - 1),
    //     })
    //     .then(() => {
    //         this.getList();
    //     })
    //     .catch((e) => {
    //         console.error(e);
    //     });
    // };
    handleDelete = () => {
        if (this.state.checkList.length == 0) {
            alert("삭제할 게시글을 선택하세요.");
            return;
        }
    
        // 선택된 게시글 ID 목록을 순회하며 DELETE 요청을 생성
        const deletePromises = this.state.checkList.map((id: any) => {
            return Axios.delete(`http://localhost:8000/api/board/${id}/`)
                .catch((e) => {
                    console.error(`Failed to delete board with ID ${id}:`, e);
                });
        });
    
        // 모든 DELETE 요청이 완료되면 게시글 목록을 다시 불러오기
        Promise.all(deletePromises)
            .then(() => {
                this.getList();
            })
            .catch((e) => {
                console.error('Failed to delete boards:', e);
            });
    };
    /**
     * @return {Component} Component
     */
    render() {
        const { boardList }: { boardList: any } = this.state;

        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>선택</th>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boardList.map((v: any) => {
                            return (
                                <Board
                                    id={v.BOARD_ID}
                                    title={v.BOARD_TITLE}
                                    registerId={v.REGISTER_ID}
                                    registerDate={v.REGISTER_DATE}
                                    key={v.BOARD_ID}
                                    props={this}
                                />
                            );
                        })}
                    </tbody>
                </Table>
                <Button variant="info">글쓰기</Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        this.props.handleModify(this.state.checkList);
                    }}
                >
                    수정하기
                </Button>
                <Button variant="danger" onClick={this.handleDelete}>
                    삭제하기
                </Button>
            </div>
        );
    }
}

export default BoardList;