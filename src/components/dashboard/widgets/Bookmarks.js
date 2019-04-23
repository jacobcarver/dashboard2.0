import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BookmarkIcon from "@material-ui/icons/NoteAdd";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { addBookmark, deleteBookmark } from '../../../redux/actions/actions';

// SCSS
import '../../../scss/Bookmarks.scss';

class Bookmarks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBookmarkForm: false,
            bookmarks: props.bookmarks,
            name: '',
            url: ''
        }
        this.addBookmark = this.addBookmark.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleUrlInput = this.handleUrlInput.bind(this);
    }
    toggleForm() {
        this.setState({
            showBookmarkForm: !this.state.showBookmarkForm
        })
    }
    handleNameInput(e) {
        this.setState({
            name: e.target.value
        })
    }
    handleUrlInput(e) {
        this.setState({
            url: e.target.value
        })
    }
    addBookmark(e) {
        e.preventDefault();
        if (this.state.url.length > 0 && this.state.name.length > 0) {
            this.setState({ showBookmarkForm: false })
            const bookmark = {
                url: this.state.url,
                name: this.state.name
            }
            this.props.addBookmark([...this.state.bookmarks, bookmark]);
        } else {
            this.setState({ showBookmarkForm: false })
        }
    }
    render() {
        const { bookmarks } = this.props;
        return (
            <div id="bookmarks" className="widget">
                {this.state.showBookmarkForm === false ?
                    <div className="header" onClick={this.toggleForm}>
                        <div className="title">
                            Bookmarks
                        </div>
                        <BookmarkIcon />
                    </div>
                    : 
                    <form onSubmit={this.addBookmark}>
                        <TextField
                        className="input"
                        label="Name"
                        onChange={this.handleNameInput}
                        value={this.state.name}
                        />
                        <TextField
                        className = "input"
                        label="Url"
                        onChange={this.handleUrlInput}
                        value={this.state.url}
                        />
                        <Button type="submit" variant="contained" color="secondary">
                            <span>+</span>
                        </Button>
                    </form>
                }
                <div className="url-bookmarks">
                    {/* If there are no bookmarks */}
                    {bookmarks.length === 0 ? <span className="no-bookmarks">No Bookmarks</span> : 
                    bookmarks.map((bookmark, index) => {
                        return (
                            <div key={index} data-id={bookmark.id} className="bookmark">
                                <a href={bookmark.url}>
                                    {bookmark.name}
                                    <img src={`${bookmark.url}/favicon.ico`} alt="LOGO" />
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

Bookmarks.propTypes = {
    addBookmark: PropTypes.func.isRequired,
    bookmarks: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    bookmarks: state.siteData.bookmarks
});

export default connect(mapStateToProps, { addBookmark })(Bookmarks);