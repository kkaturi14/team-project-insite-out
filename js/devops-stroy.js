document.addEventListener('DOMContentLoaded', () => {
  // 캐릭터 렌더링 로직 (모든 페이지에서 실행)
  const characterDisplay = document.getElementById('characterDisplay')
  const completeBtn = document.getElementById('completeBtn')
  let data = JSON.parse(localStorage.getItem('selectedCharacter'))
  const completeBtn1 = document.getElementById('completeBtn1')

  if (characterDisplay) {
    function renderCharacter() {
      characterDisplay.innerHTML = ''
      const img = document.createElement('img')
      if (data && data.image && data.name) {
        img.src = data.image
        img.alt = 'Selected Character'
        const name = document.createElement('p')
        name.textContent = data.name
        const score = document.createElement('p')
        score.className = 'score'
        score.textContent = `Score: ${data.score || 0}`
        characterDisplay.appendChild(img)
        characterDisplay.appendChild(name)
        characterDisplay.appendChild(score)
      } else {
        img.src = '/img/물음표.png'
        img.alt = 'No Character Selected'
        characterDisplay.appendChild(img)
      }
      img.onerror = () => {
        console.error('Failed to load image:', img.src)
        img.src = '/img/fallback.png'
      }
      // link-btn 추가
      const link = document.createElement('a')
      link.href = '/index.html'
      link.className = 'link-btn'
      link.textContent = '다시 선택하기'
      characterDisplay.appendChild(link)
    }

    renderCharacter()

    // "다시 선택하기" 버튼 클릭 이벤트 (위임된 이벤트로 처리)
    characterDisplay.addEventListener('click', (e) => {
      if (e.target.classList.contains('link-btn')) {
        e.preventDefault() // 기본 링크 동작 방지
        localStorage.removeItem('selectedCharacter')
        data = null
        renderCharacter()
        console.log('localStorage cleared')
        window.location.href = '/index.html' // 페이지 이동
      }
    })

    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        if (data && data.image && data.name) {
          data.score = (data.score || 0) + 1
          localStorage.setItem('selectedCharacter', JSON.stringify(data))
          console.log(`Score updated: ${data.score}`)
          renderCharacter()
        }
      })
    }
  }

  // index.html 슬라이더 로직
  const slider = document.getElementById('slider')
  if (slider) {
    const prevBtn = document.getElementById('prevBtn')
    const nextBtn = document.getElementById('nextBtn')
    const nameInput = document.getElementById('nameInput')
    const confirmBtn = document.getElementById('confirmBtn')
    const imageWrappers = slider.querySelectorAll('.image-wrapper')
    const totalImages = imageWrappers.length
    let currentIndex = 1
    let selectedImage = null

    // 무한 루프를 위해 첫 번째와 마지막 이미지 복제
    const firstWrapper = imageWrappers[0].cloneNode(true)
    const lastWrapper = imageWrappers[totalImages - 1].cloneNode(true)
    slider.insertBefore(lastWrapper, imageWrappers[0])
    slider.appendChild(firstWrapper)

    // 초기 슬라이더 위치 설정
    slider.style.transform = `translateX(-${currentIndex * 100}%)`

    // 슬라이더 이동 함수
    function updateSlider(animate = true) {
      if (animate) {
        slider.style.transition = 'transform 0.5s ease-in-out'
      } else {
        slider.style.transition = 'none'
      }
      slider.style.transform = `translateX(-${currentIndex * 100}%)`
    }

    // 다음 버튼 클릭
    nextBtn.addEventListener('click', () => {
      currentIndex++
      updateSlider(true)
      if (currentIndex === totalImages + 1) {
        setTimeout(() => {
          currentIndex = 1
          updateSlider(false)
        }, 500)
      }
    })

    // 이전 버튼 클릭
    prevBtn.addEventListener('click', () => {
      currentIndex--
      updateSlider(true)
      if (currentIndex === 0) {
        setTimeout(() => {
          currentIndex = totalImages
          updateSlider(false)
        }, 500)
      }
    })

    // 선택 버튼 클릭
    slider.addEventListener('click', (e) => {
      if (e.target.classList.contains('select-btn')) {
        const img = e.target.previousElementSibling
        if (img && img.tagName === 'IMG') {
          selectedImage = new URL(img.src, window.location.origin).href
          console.log(`Selected image: ${selectedImage}`)
        }
      }
    })

    // 확인 버튼 클릭
    confirmBtn.addEventListener('click', () => {
      const name = nameInput.value.trim()
      if (selectedImage && name) {
        localStorage.setItem(
          'selectedCharacter',
          JSON.stringify({
            image: selectedImage,
            name,
            score: data ? data.score || 0 : 0,
          })
        )
        console.log(
          `Saved to localStorage: ${selectedImage}, ${name}, score: ${
            data ? data.score : 0
          }`
        )
        alert('선택 완료!')
        window.location.href = '/index.html'
      } else {
        alert('캐릭터를 선택하고 이름을 입력하세요!')
      }
    })
  }

  // "DevOps Story 이수완료 클릭 시 점수 추가"
  if (completeBtn1) {
    completeBtn1.addEventListener('click', (e) => {
      e.preventDefault()
      if (data) {
        data.score = (data.score || 0) + 1
        localStorage.setItem('selectedCharacter', JSON.stringify(data))
      }
      alert('DevOps Story 이수를 완료했습니다!')
      window.location.href = '/index.html'
    })
  }

  // "DevOps Story Next 클릭 시 점수 추가"
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (data) {
        data.score = (data.score || 0) + 1
        localStorage.setItem('selectedCharacter', JSON.stringify(data))
        console.log(`Score updated from nextBtn: ${data.score}`)
      }
    })
  }
})
