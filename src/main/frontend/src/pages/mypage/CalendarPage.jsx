import React, {useEffect, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // 일정 추가 기능
import Sidebar from "../../layouts/sidebar.jsx"// 사이드바 추가
import "./CalendarPage.css";
import Modal from "react-modal";

Modal.setAppElement("#root");


const CalendarPage = () => {
    const [events, setEvents] = useState([
        { title: "회의", date: "2025-04-01", backgroundColor: "red", borderColor: "red"}, // 예시 1
        { title: "친구 생일 🎂", date: "2025-04-05", backgroundColor: "blue", borderColor: "blue" }, // 이모티콘 예시 1
    ]);
    const [todayTodos, setTodayTodos] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: "",
        end: "",
        backgroundColor: "red",
        borderColor: "red"
    });

    // 날짜 클릭 시 새로운 일정 추가
    const handleDateClick = (arg) => {
        setNewEvent({ title: "", start: arg.dateStr, end: arg.dateStr, backgroundColor: "#b0f7df", borderColor: "#b0f7df"});
        setModalIsOpen(true);
    };

    const addEvent = () => {
        if (newEvent.title.trim() && newEvent.start) {
            const formattedStart = newEvent.start; // input type="date"의 값은 YYYY-MM-DD 문자열
            let formattedEnd = newEvent.end ? newEvent.end : formattedStart; // end가 없으면 start와 동일하게 설정

            const endDate = new Date(formattedEnd);
            endDate.setDate(endDate.getDate()+1); // 날짜에 1을 더한 뒤 값을 재할당
            formattedEnd = endDate.toISOString().split("T")[0];

            setEvents((prevEvents) => {
                const updatedEvents = [
                    ...prevEvents,
                    {
                        title: newEvent.title,
                        start: formattedStart,
                        end: formattedEnd,
                        backgroundColor: newEvent.backgroundColor,
                        borderColor: newEvent.borderColor,
                        className: newEvent.backgroundColor,
                    }
                ];

                console.log("모달 닫기 버튼 클릭됨!");
                console.log("모달 닫기 전 이벤트 목록:", events);

                // 최신 상태를 반영한 todayTodos 업데이트
                const today = new Date().toISOString().split("T")[0];
                const todayEvents = updatedEvents.filter(event =>
                    event.start <= today && event.end >= today
                );

                console.log("업데이트된 오늘 포함된 이벤트:", todayEvents);
                setTodayTodos(todayEvents);

                return updatedEvents; // 상태 업데이트
            });

            setModalIsOpen(false);
        }
    };

    // 비동기 문제로 인하여 add와 update 사이에 위치해야함
    // 위치 수정 시 주의
    useEffect(() => {
        updateTodayTodos();
    }, [events]);

    // To-Do List 갱신
    const updateTodayTodos = () => {
        const today = new Date().toISOString().split("T")[0];
        const todayEvents = events.filter(event => {
            if (!event.start) return false;

            const eventStart = event.start.split("T")[0];
            const eventEnd = event.end ? event.end.split("T")[0] : eventStart;

            return eventStart <= today && eventEnd >= today;
        });

        console.log("오늘 날짜:", today); // F12에서 콘솔 창 확인을 위한 코드이므로 차후 수정해도 상관없음
        console.log("오늘 포함된 이벤트:", todayEvents);

        setTodayTodos(todayEvents);
    };


    return (
        <div style={{ display: "flex", height: "100vh" , padding: "20px", gap: "20px" }}>
            {/* 왼쪽 사이드바 */}
            <Sidebar />

            {/* 캘린더 & 투두 리스트 컨테이너 */}
            <div style={{ display: "flex", flex: 1, gap: "20px", width: "100%" }} >

            {/* 캘린더 */}
            <div style={{ flex: 4, padding: "20px",
                background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", minWidth: "600px" }}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    displayEventTime={false}
                    headerToolbar={{
                        start: "today",
                        center: "title",
                        end: "prev next"
                    }}
                    events={events}
                    dateClick={handleDateClick}
                    height="90vh"
                    eventClassNames={(eventInfo) => eventInfo.event.backgroundColor || "default-event"}
                    // eventClassNames={(eventInfo) => eventInfo.event.extendedProps.className}
                />
            </div>

                {/* 투두리스트 */}
                <div style={{
                    flex: 1,
                    padding: "20px",
                    background: "#f8f9fa",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    minWidth: "250px",
                    height: "45vh"
                }}>
                    <h3 style={{ textAlign: "center" }}>To-Do List</h3>
                    <ul style={{ listStyle: "none", paddingLeft: "10px" }}>
                        {todayTodos.length > 0 ? (
                            todayTodos.map((event, index) => <li key={index}> ✔ {event.title}</li>)
                        ) : (
                            <li>오늘 일정이 없습니다.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* 일정 추가 모달 */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                <h2>일정 추가</h2>
                <label>제목: </label>
                <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <label>시작 날짜: </label>
                <input
                    type="date"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                />
                <label>종료 날짜: </label>
                <input
                    type="date"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                />
                <label>일정 색상: </label>
                <select
                    value={newEvent.backgroundColor}
                    onChange={(e) =>
                        setNewEvent({
                            ...newEvent,
                            backgroundColor: e.target.value,
                            borderColor: e.target.value
                        })
                    }
                >
                    <option value="#b0f7df">기본</option>
                    <option value="red">빨강색</option>
                    <option value="blue">파랑색</option>
                    <option value="green">초록색</option>
                    <option value="yellow">노랑색</option>
                    <option value="orange">주황색</option>
                    <option value="purple">보라색</option>
                </select>
                <button onClick={addEvent}>추가</button>
                <button onClick={() => setModalIsOpen(false)}>취소</button>
            </Modal>
        </div>
    );
};

export default CalendarPage;
