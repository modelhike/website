package com.example.flightmodule.station.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;
import com.example.flightmodule.station.model.*;

@Component
public class DeleteStationCommand {

  private static final Logger LOG = LoggerFactory.getLogger(DeleteStationCommand.class);

  private final StationRepository repository;

  @Autowired
  public DeleteStationCommand(StationRepository repository) {
    this.repository = repository;
  }

  public Mono<Void> run(String id) {

    LOG.debug("deleteStationCommand: tries to delete an entity with Id: {}", id);

    return repository.deleteById(id);
  }

}
