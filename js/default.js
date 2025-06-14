// 캐릭터 렌더링 로직 (모든 페이지에서 실행)

    const characterDisplay = document.getElementById('characterDisplay');
    const completeBtn = document.getElementById('completeBtn');
    let data = JSON.parse(localStorage.getItem('selectedCharacter'));

    if (characterDisplay) {
        function renderCharacter() {
            characterDisplay.innerHTML = '';
            const img = document.createElement('img');
            if (data && data.image && data.name) {
                img.src = data.image;
                img.alt = 'Selected Character';
                const name = document.createElement('p');
                name.textContent = data.name;
                const score = document.createElement('p');
                score.className = 'score';
                score.textContent = `Score: ${data.score || 0}`;
                characterDisplay.appendChild(img);
                characterDisplay.appendChild(name);
                characterDisplay.appendChild(score);
            } else {
                img.src = '/img/물음표.png';
                img.alt = 'No Character Selected';
                characterDisplay.appendChild(img);
            }
            img.onerror = () => {
                console.error('Failed to load image:', img.src);
                img.src = '/img/fallback.png';
            };
            // link-btn 추가
            const link = document.createElement('a');
            link.href = '/index.html';
            link.className = 'link-btn';
            link.textContent = '다시 선택하기';
            characterDisplay.appendChild(link);
        }

        renderCharacter();

        // "다시 선택하기" 버튼 클릭 이벤트 (위임된 이벤트로 처리)
        characterDisplay.addEventListener('click', (e) => {
            if (e.target.classList.contains('link-btn')) {
                e.preventDefault(); // 기본 링크 동작 방지
                localStorage.removeItem('selectedCharacter');
                data = null;
                renderCharacter();
                console.log('localStorage cleared');
                window.location.href = '/index.html'; // 페이지 이동
            }
        });

        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                if (data && data.image && data.name) {
                    data.score = (data.score || 0) + 1;
                    localStorage.setItem('selectedCharacter', JSON.stringify(data));
                    console.log(`Score updated: ${data.score}`);
                    renderCharacter();
                }
            });
        }
    }
    