import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Alert } from 'reactstrap';
import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: null,
    messageError: '',
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true, error: false });

    try {
      const { newRepo, repositories } = this.state;

      if (newRepo === '') throw 'Digite um repositório';

      const checkRepo = repositories.find(r => r.name === newRepo);

      if (checkRepo) throw 'Repositório duplicado';

      const response = await api.get(`repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        messageError: '',
        error: false,
      });
    } catch (error) {
      this.setState({ messageError: error, error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { newRepo, loading, repositories, error, messageError } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Alert color="danger" error>
          {messageError}
        </Alert>
        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span> {repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
