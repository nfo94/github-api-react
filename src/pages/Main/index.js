import React, { Component } from "react";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import api from "../../services/api";

import { Container, Form, SubmitButton, List } from "./styles";

export default class Main extends Component {
  state = {
    newRepository: "",
    repositories: [],
    loading: false,
  };

  // when it mounts, check the local storage and grab whats there
  componentDidMount() {
    const repositories = localStorage.getItem("repositories");
    if (repositories) this.setState({ repositories: JSON.parse(repositories) });
  }

  // when it updates, store whats the user typed
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem("repositories", JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepository: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { newRepository, repositories } = this.state;

    this.setState({ loading: true });
    const response = await api.get(`repos/${newRepository}`);
    const data = {
      name: response.data.full_name,
    };

    this.setState({
      newRepository: "",
      repositories: [...repositories, data],
      loading: false,
    });
  };

  render() {
    const { newRepository, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositories
        </h1>
        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Add repository"
            value={newRepository}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <a href={repository}>Details</a>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
