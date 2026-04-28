with open('index.html', 'r') as f:
    text = f.read()

start_marker = r'          <div class="youtube-cards-wrapper">'
end_marker = r'          </div>\n        </div>\n      </section>'

replacement = '''          <div class="youtube-cards-wrapper">
            <!-- English Card -->
            <div class="yt-vt-card">
              <!-- Back Face -->
              <div class="yt-vt-back">
                <div class="yt-vt-back-content">
                  <div class="yt-badge yt-badge-blue">English</div>
                  <h3 class="yt-back-title">Physiotherapy for Knee Osteoarthritis</h3>
                  <p class="yt-back-desc">Targeted strengthening exercises to reduce pain and improve mobility &mdash; by Dr. Vijaykumar D, AIIMS Delhi.</p>
                  <a href="https://www.youtube.com/watch?v=vminONFLauo" class="yt-watch-btn">
                    <ion-icon name="play" style="font-size: 20px;"></ion-icon> Watch on YouTube
                  </a>
                </div>
              </div>

              <!-- Template for the front face to avoid repetition -->
              <div class="yt-vt-front-template" style="display: none;">
                <div class="yt-front-inner">
                  <img class="yt-front-bg" src="src/youtube_videos/yt_Video1.png" alt="Video Thumbnail">
                  <div class="yt-front-overlay"></div>
                  
                  <div class="yt-pulse-btn">
                    <div class="yt-pulse-ring"></div>
                    <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                  </div>
                  <div class="yt-front-bottom">
                    <div class="yt-badge yt-badge-white">English</div>
                    <h3 class="yt-front-title">Knee Strengthening Exercises &mdash; Osteoarthritis</h3>
                    <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                  </div>
                </div>
              </div>
              
              <!-- Front Face Container (Strips injected via JS) -->
              <div class="yt-vt-front"></div>
            </div>

            <!-- Hindi Card -->
            <div class="yt-vt-card">
              <!-- Back Face -->
              <div class="yt-vt-back">
                <div class="yt-vt-back-content">
                  <div class="yt-badge yt-badge-blue">हिंदी</div>
                  <h3 class="yt-back-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                  <p class="yt-back-desc">Targeted strengthening exercises to reduce pain and improve mobility &mdash; by Dr. Vijaykumar D, AIIMS Delhi.</p>
                  <a href="https://www.youtube.com/watch?v=vminONFLauo" class="yt-watch-btn">
                    <ion-icon name="play" style="font-size: 20px;"></ion-icon> Watch on YouTube
                  </a>
                </div>
              </div>

              <!-- Template for the front face -->
              <div class="yt-vt-front-template" style="display: none;">
                <div class="yt-front-inner">
                  <img class="yt-front-bg" src="src/youtube_videos/yt_Video1.png" alt="Video Thumbnail">
                  <div class="yt-front-overlay"></div>
                  
                  <div class="yt-pulse-btn">
                    <div class="yt-pulse-ring"></div>
                    <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                  </div>
                  <div class="yt-front-bottom">
                    <div class="yt-badge yt-badge-white">हिंदी</div>
                    <h3 class="yt-front-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                    <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                  </div>
                </div>
              </div>
              
              <!-- Front Face Container (Strips injected via JS) -->
              <div class="yt-vt-front"></div>
            </div>
          </div>
'''
try:
    start_idx = text.index(start_marker)
    end_idx = text.index(end_marker)
    new_text = text[:start_idx] + replacement + text[end_idx:]
    with open('index.html', 'w') as f:
        f.write(new_text)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
