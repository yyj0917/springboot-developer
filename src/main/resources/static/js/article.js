//삭제 기능
const deleteButton = document.getElementById('delete-btn');

if (deleteButton) {
    deleteButton.addEventListener('click', event => {
        let id = document.getElementById('article-id').value;

        function success() {
            alert("삭제가 완료되었습니다.");
            location.replace("/articles");
        }

        function fail() {
            alert("삭제 실패했습니다.");
            location.replace("/articles");
        }

        httpRequest("DELETE", "/api/articles/" + id, null, success, fail);
    });
}
// HTML에서 id가 'delete-btn'인 엘리먼트가 deleteButton이고,
// 그걸 찾고, 그 엘리먼트에 클릭 이벤트가 발생하면 fetch로 그 주소로 넘어가 delete메서드를 실행하고
// .then()이 실행되면서 삭제 알림을 주고 /articles주소로 대체됨.

const modifyButton = document.getElementById('modify-btn');

if (modifyButton) {
    modifyButton.addEventListener('click', event => {
        let params = new URLSearchParams(location.search);
        let id = params.get('id');

        body = JSON.stringify({
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
        });
        function success() {
            alert("수정 완료되었습니다.");
            location.replace("/articles/" + id);
        }

        function fail() {
            alert("수정 실패했습니다.");
            location.replace("/articles/" + id);
        }

        httpRequest("PUT", "/api/articles/" + id, body, success, fail);
    });
}

const createButton = document.getElementById('create-btn');

if (createButton) {
     createButton.addEventListener('click', event => {
         body = JSON.stringify({ // 자바 or js 객체를 JSON으로 바꿔주는 함수.
             title: document.getElementById('title').value,
             content: document.getElementById('content').value,
         });

         function success() {
             alert("등록 완료되었습니다.");
             location.replace("/articles");
         }

         function fail() {
             alert("등록 실패했습니다.");
             location.replace("/articles");
         }

         httpRequest("POST", "/api/articles", body, success, fail);
     });
}
// 쿠키를 가져오는 함수
function getCookie(key) {
    var result = null;
    var cookie = document.cookie.split(";");
    cookie.some(function (item) {
        item = item.replace(" ", "");

        var dic = item.split("=");

        if (key === dic[0]) {
            result = dic[1];
            return true;
        }
    });

    return result;
}

// HTTP 요청을 보내는 함수
function httpRequest(method, url, body, success, fail) {
    fetch(url, {
        method: method,
        headers: {
            // 로컬 스토리지에서 액세스 토큰 값을 가져와 헤더에 추가
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-type": "application/json",
        },
        body: body,
    }).then((response) => {
        if (response.status === 200 || response.status === 201) {
            return success();
        } // 액세스 토큰이 있어서 정상적으로 흘러감.
        const refresh_token = getCookie("refresh_token");
        if (response.status === 401 && refresh_token) {
            fetch("/api/token", {
                method: "POST",
                headers: {
                    Authorization: "Bearer" + localStorage.getItem("access_token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refreshToken: getCookie("refresh_token"),
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((result) => {
                    // 재발급이 성공하면 로컬 스토리지값을 새로운 액세스 토큰으로 교체
                    localStorage.setItem("access_token", result.accessToken);
                    httpRequest(method, url, body, success, fail);
                })
                .catch((error) => fail());
        } else {
            return fail();
        }
    });
}
// 이 코드는 POST 요청을 보낼 때 액세스 토큰도 함께 보낸다.
// 만약 응답에 권한이 없다는 에러 코드가 발생하면 리프레시 토큰과 함께 새로운 액세스 토큰을 청하고,
// 전달받은 액세스 토큰으로 다시 API를 요청한다.

