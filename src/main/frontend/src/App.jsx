import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Sidebar from "./layouts/sidebar";
import CalendarPage from "./pages/mypage/CalendarPage.jsx";
// 캘린더에 사이드바를 import 해두었다. 추후 수정 요망
function App() {
    // const [data, setData] = useState('');
    //
    // useEffect(() => {
    //     // API 호출
    //     axios.get('/api/data')
    //         .then(response => {
    //             setData(response.data);  // API 응답을 상태에 저장
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data', error);
    //         });
    // }, []);  // 컴포넌트가 마운트될 때 한 번만 실행

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: '0 0 800px', padding: '10px' }}> {/* CalendarPage의 너비를 800px로 설정 */}
                <CalendarPage />
            </div>
            {/*<div style={ {flex: 1, padding: '10px'}}>*/}
            {/*    <h1>받아온 값</h1>*/}
            {/*    <p>{data}</p>*/}
            {/*</div>*/}
        </div>
    );

}

export default App;
