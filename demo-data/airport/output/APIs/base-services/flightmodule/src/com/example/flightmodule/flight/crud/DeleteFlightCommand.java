package com.example.flightmodule.flight.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;
import com.example.flightmodule.flight.model.*;

@Component
public class DeleteFlightCommand {

  private static final Logger LOG = LoggerFactory.getLogger(DeleteFlightCommand.class);

  private final FlightRepository repository;

  @Autowired
  public DeleteFlightCommand(FlightRepository repository) {
    this.repository = repository;
  }

  public Mono<Void> run(String id) {

    LOG.debug("deleteFlightCommand: tries to delete an entity with Id: {}", id);

    return repository.deleteById(id);
  }

}
