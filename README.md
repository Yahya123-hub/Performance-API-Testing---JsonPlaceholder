## 📌 Overview
This project focuses on **performance testing** of the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) using **JMeter, Jenkins, and Postman**. The objective was to evaluate API response times, concurrency handling, and overall system stability under different loads.

## 📂 Repository Contents
- **JMeter Test Plan (`jsonplaceholder-jmeter.jmx`)** – The JMeter script defining multiple thread groups for different test scenarios.
- **Postman Collection (`jsonplaceholder-postman.json`)** – API functional test cases before performance testing.
- **Test Reports (`jmeter-report/`)** – Load test results including response time, throughput, and error rate.
- **Jenkins Pipeline (`Jenkinsfile`)** – Automated performance testing setup using Jenkins.
- **Screenshots (`screenshots/`)** – Key insights from test executions.

## 📝 Performance Testing Strategy
- **API Tested**: JSONPlaceholder (Simulated REST API)
- **Test Approach**:
  1. **Functional Verification** – Ensured API endpoints were responding correctly using **Postman**.
  2. **Load Testing** – Simulated multiple concurrent users making requests.
  3. **Stress Testing** – Pushed the API beyond its limits to observe failure points.
  4. **Spike Testing** – Sent an extreme number of requests suddenly to test how the API handles traffic spikes.

## 🔄 JMeter Thread Groups & Test Scenarios
We structured the JMeter test plan using **multiple thread groups** to simulate different load conditions:

### **1️⃣ Baseline Performance Test**
- **Thread Group**: Single user sending sequential API requests.
- **Goal**: Establish a baseline response time without load.

### **2️⃣ Concurrent User Load Test**
- **Thread Group**: 50 virtual users.
- **Ramp-up Time**: 10 seconds.
- **Loop Count**: Continuous requests for 5 minutes.
- **Goal**: Measure average response time and throughput under normal load.

### **3️⃣ Stress Test**
- **Thread Group**: 200 virtual users.
- **Ramp-up Time**: 30 seconds.
- **Duration**: 10 minutes.
- **Goal**: Identify breaking points and API failure rate under heavy load.

### **4️⃣ Spike Test**
- **Thread Group**: 500 virtual users.
- **Ramp-up Time**: 5 seconds (sudden spike).
- **Goal**: Observe how the API handles a sudden surge in traffic.

### **5️⃣ Endurance Test**
- **Thread Group**: 100 users.
- **Test Duration**: 1 hour.
- **Goal**: Assess API performance over an extended period.

## ⚙️ Tools & Technologies
- **JMeter**: Designed and executed performance tests.
- **Postman**: Verified API responses before performance testing.
- **Jenkins**: Automated performance test execution via CI/CD pipeline.
- **CSV Data Config**: Used parameterized requests with different test data.
- **Listeners**:
  - **Summary Report**: Aggregated test metrics.
  - **View Results Tree**: Debugging individual request responses.
  - **Graph Results**: Visual representation of API response trends.

## 📊 Key Performance Metrics
- **Response Time** – Average and 90th percentile response time.
- **Throughput** – Requests per second handled by the API.
- **Error Rate** – Percentage of failed requests.
- **CPU & Memory Impact** – Observed system resource usage during high load.

## 🎯 Key Learnings
- Designing structured performance test plans with **multiple thread groups**.
- Configuring **JMeter listeners and timers** for accurate results.
- Automating performance testing using **Jenkins pipelines**.
- Identifying **performance bottlenecks and optimizing API response times**.

## 🚀 How to Use
Clone the repository

Run Postman Tests

Import jsonplaceholder-postman.json and verify API responses.

Run JMeter Tests

Open Apache JMeter and load jsonplaceholder-jmeter.jmx.

Select different thread groups to execute specific load tests.

View real-time results using Graph Results & Summary Report.

Run Automated Tests via Jenkins:

Use the provided Jenkinsfile to integrate JMeter into Jenkins.

Monitor test execution and reports from Jenkins dashboard.

Analyze Performance Reports:

Navigate to jmeter-report/ for detailed test results.

![jjp (5)](https://github.com/user-attachments/assets/37729f89-8a74-4e58-bc84-64f3fc029fc4)
![jjp (6)](https://github.com/user-attachments/assets/600487da-8258-43a5-8206-0b09bf888aa2)
![jjp (2)](https://github.com/user-attachments/assets/5797f22d-03f9-4fe9-991c-bdda4599c900)
![jjp (7)](https://github.com/user-attachments/assets/86bd3a51-1c83-4817-8c34-2f3b3dc7444a)
![jjp (4)](https://github.com/user-attachments/assets/9fd78a50-d205-4146-b27e-41612224ab15)
![jjp (3)](https://github.com/user-attachments/assets/1015314d-1826-4e7a-b64f-c0a5867777cd)
![jjp (1)](https://github.com/user-attachments/assets/758e6538-bfff-4441-99a5-d611da855f5e)


