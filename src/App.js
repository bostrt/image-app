import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Pagination from "react-js-pagination";

class App extends Component {
    render() {
        return (
            <Router>
            <Main />
            </Router>
        );
    }
}

class Main extends Component {
    render() {
        return (
        <div>
            <Navigation />
            <div className="wrapper">
            <div className="container">
            <Switch>
                <Route exact path="/" component={ImageForm}/>
                <Route path="/recent" component={RecentImageList}/>
                <Route path="/about" component={About}/>         
            </Switch>
            </div>
            </div>
        </div>
        );
    }
}

class UploadInfo extends Component {
    constructor(props) {
        super(props);
        this.imageUrl = props.imageUrl;
        this.deleteUrl = props.deleteUrl;
    }
    render() {
        return (
            <table className="u-full-width">
                <thead><tr></tr></thead>
                <tbody>
                    <tr>
                        <td><b>Image URL</b></td>
                        <td><a href={this.imageUrl}>{this.imageUrl}</a></td>
                    </tr>
                    <tr>
                        <td><b>Delete Image URL</b></td>
                        <td><a href={this.deleteUrl}>{this.deleteUrl}</a></td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class ImageForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = { uploaded: false, lastUrl: null, lastDeleteUrl: null};
    }
    
    handleChange(event) {
        console.log(event);        
    }
    
    handleSubmit(event) {
        event.preventDefault();
        var data = new FormData(event.target);
        data.set('json', 'true');
        var that = this;
        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: data
        }).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    that.clearForm();
                    that.setState({uploaded: true, lastUrl: data['image-url'], lastDeleteUrl: data['delete-url']});
                })
            } else {
                alert('Error uploading image. Please contact your web master.');
            }
        })
    }
    
    clearForm() {
        document.getElementById("upload-form").reset();        
    }
    
    render() {
        var uploadInfo;
        console.log(this.state);
        if (this.state.uploaded) {
            uploadInfo = <UploadInfo imageUrl={ this.state.lastUrl } deleteUrl={ this.state.lastDeleteUrl }/>;
        }
        return (
            <form id="upload-form" onSubmit={ this.handleSubmit } method="POST" encType="multipart/form-data">
                <div className="six columns">
                <input className="u-full-width" placeholder="Your name (optional)" type="text" name="owner"/>
                </div>
                <input className="u-full-width" type="file" name="file" required="true "/>
                <input className="button-primary" type="submit"/>                  
                <label>
                    <input type="checkbox" name="private"/>
                    <span className="label-body">Unlisted / Private</span>
                </label>
                { uploadInfo }
            </form>
        );
    }
}

class RecentImageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          activePage: 1,
          data: []
        };
    }

    handlePageChange(pageNumber) {
      console.log(`active page is ${pageNumber}`);
      console.log(this)
      this.setState({activePage: pageNumber});
    }
    
    async doFetch() {
        var that = this;
        fetch('http://localhost:5000/recent')
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(jsonData) {
                        that.setState({data: jsonData});
                    });
                }
            });
    }
    
    render() {
        return <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={10}
                totalItemsCount={450}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
              />
            </div>
    }
}

class About extends Component {
    render() {
        return 'this is the about page!';
    }
}

class Navigation extends Component {
    render() {
        return (
        <nav id="navigation">
            <div className="container">
            <Link to="/" className="nav-link">HOME</Link>
            <Link to="/recent" className="nav-link">RECENT</Link>    
            <Link to="/about" className="nav-link">ABOUT</Link>   
            </div>
        </nav>
        )
    }
}

export default App;
