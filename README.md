# EDUCATION KOTARO AI

## Mô tả dự án
EDUCATION KOTARO AI là một nền tảng giáo dục toàn diện về khoa học và thiên văn học, được xây dựng bằng React (frontend) và Node.js (backend). 
Dự án cung cấp các tài liệu học tập, bài quiz, chatbot AI, và tích hợp với API NASA để khám phá vũ trụ. Đây là phiên bản cải 
tiến 2025 của dự án, với giao diện người dùng hiện đại và các tính năng học tập tương tác.

## Tính năng chính

### 🏫 Thư viện học tập
- **Hóa học**: Tài liệu và bài giảng về các nguyên tố, phản ứng hóa học
- **Vật lý**: Các khái niệm vật lý cơ bản và nâng cao
- **Sinh học**: Kiến thức về sinh vật, tế bào, di truyền
- **Nghiên cứu khoa học**: Phương pháp nghiên cứu và thí nghiệm
- **Ôn thi HSG**: Tài liệu ôn tập cho học sinh giỏi

### 🌌 Thiên văn học
- **Hệ mặt trời**: Khám phá các hành tinh và vệ tinh
- **Trái đất**: Hình ảnh và dữ liệu về hành tinh xanh
- **Tiểu hành tinh**: Thông tin về vành đai tiểu hành tinh
- **Hành tinh khác**: Các ngoại hành tinh và hệ sao khác
- **Hình ảnh NASA**: Bộ sưu tập ảnh thiên văn từ NASA
- **Robot Sao Hỏa**: Thông tin về các nhiệm vụ thám hiểm Sao Hỏa

### 🤖 Chatbot AI
- Trợ lý AI thông minh "Trợ lý Sen AI tỉnh Đồng Tháp"
- Hỗ trợ trả lời câu hỏi về khoa học, toán học, vật lý, hóa học
- Tích hợp với Ollama để chạy các model AI local
- Giao diện chat hiện đại với markdown support
- Hỗ trợ copy, regenerate và feedback cho câu trả lời

### 📝 Hệ thống Quiz
- Tích hợp với OpenTDB API để lấy câu hỏi trắc nghiệm
- Hỗ trợ nhiều chủ đề: khoa học, lịch sử, địa lý, giải trí, v.v.
- Các mức độ khó: dễ, trung bình, khó
- Tự động dịch câu hỏi sang tiếng Việt
- Giao diện quiz tương tác với feedback tức thời

### 🧪 Phòng thí nghiệm ảo
- **Lab 2D**: Phòng thí nghiệm ảo 2 chiều
- **VR/AR**: Công nghệ thực tế ảo và tăng cường (iframe từ dự án riêng)

### 📧 Tính năng khác
- **Gửi email**: Hệ thống liên hệ với reCAPTCHA protection
- **Tích hợp NASA API**: Lấy dữ liệu rover và hình ảnh từ NASA
- **Responsive design**: Tương thích với mọi thiết bị

## Cài đặt

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 9.0.0
- (Tùy chọn) Ollama để chạy chatbot AI local

### Các bước cài đặt
1. Clone repository:
   ```bash
   git clone <repository-url>
   cd education-kotaro-ai-better
   ```

2. Cài đặt dependencies cho cả frontend và backend:
   ```bash
   npm run install:all
   ```

3. Tạo file `.env` trong thư mục `backend`:
   ```env
   # Email configuration (cho tính năng gửi email)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CONTACT_EMAIL=contact@education-kotaro-ai.com

   # NASA API (tùy chọn)
   NASA_API_KEY=your-nasa-api-key

   # reCAPTCHA (tùy chọn)
   RECAPTCHA_SECRET=your-recaptcha-secret

   # Port configuration
   PORT=5000
   HOST=0.0.0.0
   ```

4. (Tùy chọn) Cài đặt và chạy Ollama cho chatbot:
   ```bash
   # Download và cài đặt Ollama từ https://ollama.ai
   ollama pull qwen2.5-coder:7b  # hoặc model khác
   ollama serve
   ```

## Chạy dự án

### Chạy development mode
```bash
# Chạy cả frontend và backend cùng lúc
npm run dev
```

### Chạy riêng từng phần
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Build production
```bash
# Build cả frontend và backend
npm run build

# Build riêng
npm run build:backend
npm run build:frontend
```

## Cấu trúc dự án

```
education-kotaro-ai-better/
├── backend/                          # Backend Node.js
│   ├── routes/
│   │   ├── email.js                 # API gửi email
│   │   ├── nasa.js                  # API NASA integration
│   │   └── quiz.js                  # API tạo quiz
│   ├── package.json
│   └── server.js                    # Server chính
├── frontend/                         # Frontend React
│   ├── public/
│   │   └── assets/                  # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Chatbot.tsx         # Component chatbot
│   │   │   ├── Header.tsx          # Header component
│   │   │   └── Footer.tsx          # Footer component
│   │   ├── pages/                   # Các trang
│   │   │   ├── Home.tsx            # Trang chủ
│   │   │   ├── Quiz.tsx            # Trang quiz
│   │   │   ├── VR-AR.tsx           # Trang VR/AR
│   │   │   └── ...                 # Các trang khác
│   │   ├── services/
│   │   │   └── api.ts              # API service layer
│   │   ├── theme/                  # Material-UI theme
│   │   └── utils/                  # Utilities
│   ├── package.json
│   └── vite.config.ts               # Vite configuration
├── package.json                     # Root package.json
└── README.md
```

## Công nghệ sử dụng

### Frontend
- **React 18**: Framework JavaScript cho UI
- **TypeScript**: Type-safe JavaScript
- **Material-UI (MUI)**: Component library
- **React Router**: Client-side routing
- **Vite**: Build tool và dev server
- **Axios**: HTTP client
- **React Markdown**: Render markdown
- **React Syntax Highlighter**: Code highlighting

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Nodemailer**: Email sending
- **Axios**: HTTP requests
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variables

### APIs & Services
- **NASA API**: Dữ liệu thiên văn và hình ảnh
- **OpenTDB**: Database câu hỏi trắc nghiệm
- **Google Translate API**: Dịch câu hỏi
- **Ollama**: Local AI model serving
- **reCAPTCHA**: Spam protection

## API Endpoints

### Backend APIs
- `GET /health` - Health check
- `POST /api/email/send` - Gửi email liên hệ
- `GET /api/nasa/rovers` - Lấy danh sách rover NASA
- `GET /api/nasa/photos` - Lấy hình ảnh từ rover
- `POST /api/quiz/generate` - Tạo câu hỏi quiz

### Frontend Routes
- `/` - Trang chủ
- `/chatbot` - Chatbot AI
- `/thu-vien/*` - Thư viện học tập
- `/thien-van/*` - Thiên văn học
- `/quiz` - Bài kiểm tra
- `/lab/lab2d` - Phòng thí nghiệm 2D
- `/vr-ar` - VR/AR experience
- `/lien-he` - Liên hệ

## Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Hãy làm theo các bước sau:

1. Fork dự án
2. Tạo branch mới: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Tạo Pull Request

### Quy tắc đóng góp
- Tuân thủ code style hiện tại
- Viết commit messages rõ ràng
- Test kỹ trước khi submit PR
- Cập nhật documentation nếu cần

## Đội ngũ phát triển

### Đỗ Nguyễn Đăng Khoa
- **Vai trò**: Front End Developer
- **Trường**: THPT Long Khanh A, Đồng Tháp
- **Kỹ năng**: HTML, CSS, JavaScript, React, Node.js, TypeScript, C++, Python

### Nguyễn Văng Ngọc Tiến
- **Vai trò**: Back End Developer
- **Trường**: THPT Long Khanh A, Đồng Tháp
- **Kỹ năng**: HTML, CSS, JavaScript, React, Node.js, TypeScript, C++, Python

## Lịch sử phiên bản

- **v1.0.0 (2024)**: Phiên bản đầu tiên - Website Khoa Học Tự Nhiên
- **v2.0.0 (2025)**: EDUCATION KOTARO AI - Thêm chatbot và NASA integration
- **v3.0.0 (2026)**: EDUCATION KOTARO AI BETTER - Phiên bản hiện tại với UI cải tiến
 
 

