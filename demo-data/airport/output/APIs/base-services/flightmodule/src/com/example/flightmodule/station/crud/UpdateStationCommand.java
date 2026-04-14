package com.example.flightmodule.station.crud;

import static java.util.logging.Level.FINE;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.core.publisher.Mono;
import org.springframework.stereotype.Component;
import com.example.flightmodule.station.model.*;

@Component
public class UpdateStationCommand {

  private static final Logger LOG = LoggerFactory.getLogger(UpdateStationCommand.class);

  private final StationRepository repository;

  @Autowired
  public UpdateStationCommand(StationRepository repository) {
    this.repository = repository;
  }

  public Mono<Station> run(Mono<Station> input) {

    return input.flatMap(repository :: save);
  }

}
