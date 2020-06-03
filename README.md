# Web pillow
![UI](https://user-images.githubusercontent.com/33002299/83679350-8ff96e00-a5df-11ea-8527-de5a31dfbb30.PNG)
Web application for image processing using Python library Pillow. The application consists of three parts:
* web client (JavaScript ES6, React.js)
* proxy server (Java 11, Spring Boot)
* server performing image processing (Python 3, Flask) 

## Server
Enter `backend/python/web-pillow` directory.
#### Installation
Use `pip` to install required modules.
```
pip install -r requirements.txt
```
#### Usage
Use `python` to run the server
```
python app.py
```
## Proxy server
Enter `backend/java/web-pillow` directory.
#### Usage
 To run the server execute:
```
gradlew bootRun
```
## Web client
Enter `frontend/web-pillow` directory.
#### Installation
To install all necessary dependencies execute:
```
npm install
```
#### Usage
To run the application execute:
```
npm start
```
To use the application after running its three parts open http://localhost:3000 in browser.