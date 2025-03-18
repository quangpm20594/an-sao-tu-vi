# an-sao-tu-vi
AI generate code

# Prompt 
**Yêu cầu phát triển ứng dụng Tử Vi Việt Nam:**
Tôi cần xây dựng ứng dụng web chuyên nghiệp bằng Next.js  + TypeScript với các yêu cầu:
1. **Phần lõi tử vi:**
- Sử dụng thư viện lunar-typescript để xử lý chính xác lịch âm
- Triển khai thuật toán tính toán tử vi chính xác bao gồm:
  * Thiên Can, Địa Chi năm/tháng/ngày/giờ
  * Cục và Ngũ Hành cục
  * An sao chính xác theo tiêu chuẩn Tử Vi Đẩu Số cổ điển
  * Xác định vị trí 12 cung chính và phụ
- Kiểm tra kết quả với các case test kinh điển (ví dụ: Lá số của các nhân vật lịch sử)
2. **Thư viện và công nghệ:**
- Next.js  App Router
- TypeScript
- lunar-typescript
- React-Konva cho phần vẽ lá số
- OpenAI API cho phần luận giải
3. **Yêu cầu giao diện:**
- Thiết kế canvas tương tự mẫu: https://booking.xemtuvi.vn/la-so-tu-vi/LHSOT00GDA.html, Ảnh lá số tử vi mẫu đính kèm
- Hệ thống màu sắc theo ngũ hành
4. **Tích hợp AI:**
- Tạo prompt engineering chuyên sâu về tử vi
- Xử lý context dài cho phân tích chi tiết
- Kết hợp dữ liệu lá số và bối cảnh xã hội hiện đại
- Thêm chế độ đối thoại Q&A với AI
5. **Yêu cầu chất lượng:**
- Unit test với Jest cho các thuật toán tử vi
- Error boundary cho các tính toán phức tạp
- Web Worker xử lý tính toán nặng
- Validation đầu vào theo lịch sử 100 năm (1900-2100)
**Hãy cung cấp:**
1. Kiến trúc hệ thống chi tiết
2. Triển khai thuật toán an sao với TypeScript
3. Cách xử lý múi giờ và chuyển đổi lịch
4. Integration pattern cho OpenAI API
5. Giải pháp tối ưu hiệu năng render canvas
**Tài liệu tham khảo:**
- Tiêu chuẩn an sao của Hiệp Hội Nghiên Cứu Tử Vi Quốc Tế
- Sách "Tử Vi Đẩu Số Tinh Điển" của Vũ Tài Lục
- Các nghiên cứu về thiên văn học hiện đại ứng dụng trong tử vi
**Output mong muốn:**
- Code mẫu chất lượng production
- Giải thích chi tiết bằng Tiếng Việt
- Cách triển khai real-time update
- Security best practices cho API endpoints
