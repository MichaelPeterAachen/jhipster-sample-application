package com.myapp.web.rest;

import com.myapp.domain.AmountContained;
import com.myapp.repository.AmountContainedRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.AmountContained}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AmountContainedResource {

    private final Logger log = LoggerFactory.getLogger(AmountContainedResource.class);

    private static final String ENTITY_NAME = "amountContained";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AmountContainedRepository amountContainedRepository;

    public AmountContainedResource(AmountContainedRepository amountContainedRepository) {
        this.amountContainedRepository = amountContainedRepository;
    }

    /**
     * {@code POST  /amount-containeds} : Create a new amountContained.
     *
     * @param amountContained the amountContained to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new amountContained, or with status {@code 400 (Bad Request)} if the amountContained has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/amount-containeds")
    public ResponseEntity<AmountContained> createAmountContained(@Valid @RequestBody AmountContained amountContained)
        throws URISyntaxException {
        log.debug("REST request to save AmountContained : {}", amountContained);
        if (amountContained.getId() != null) {
            throw new BadRequestAlertException("A new amountContained cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AmountContained result = amountContainedRepository.save(amountContained);
        return ResponseEntity
            .created(new URI("/api/amount-containeds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /amount-containeds/:id} : Updates an existing amountContained.
     *
     * @param id the id of the amountContained to save.
     * @param amountContained the amountContained to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amountContained,
     * or with status {@code 400 (Bad Request)} if the amountContained is not valid,
     * or with status {@code 500 (Internal Server Error)} if the amountContained couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/amount-containeds/{id}")
    public ResponseEntity<AmountContained> updateAmountContained(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AmountContained amountContained
    ) throws URISyntaxException {
        log.debug("REST request to update AmountContained : {}, {}", id, amountContained);
        if (amountContained.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amountContained.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amountContainedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AmountContained result = amountContainedRepository.save(amountContained);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amountContained.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /amount-containeds/:id} : Partial updates given fields of an existing amountContained, field will ignore if it is null
     *
     * @param id the id of the amountContained to save.
     * @param amountContained the amountContained to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amountContained,
     * or with status {@code 400 (Bad Request)} if the amountContained is not valid,
     * or with status {@code 404 (Not Found)} if the amountContained is not found,
     * or with status {@code 500 (Internal Server Error)} if the amountContained couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/amount-containeds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AmountContained> partialUpdateAmountContained(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AmountContained amountContained
    ) throws URISyntaxException {
        log.debug("REST request to partial update AmountContained partially : {}, {}", id, amountContained);
        if (amountContained.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amountContained.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amountContainedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AmountContained> result = amountContainedRepository
            .findById(amountContained.getId())
            .map(existingAmountContained -> {
                if (amountContained.getAmount() != null) {
                    existingAmountContained.setAmount(amountContained.getAmount());
                }
                if (amountContained.getUnit() != null) {
                    existingAmountContained.setUnit(amountContained.getUnit());
                }

                return existingAmountContained;
            })
            .map(amountContainedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amountContained.getId().toString())
        );
    }

    /**
     * {@code GET  /amount-containeds} : get all the amountContaineds.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of amountContaineds in body.
     */
    @GetMapping("/amount-containeds")
    public List<AmountContained> getAllAmountContaineds() {
        log.debug("REST request to get all AmountContaineds");
        return amountContainedRepository.findAll();
    }

    /**
     * {@code GET  /amount-containeds/:id} : get the "id" amountContained.
     *
     * @param id the id of the amountContained to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the amountContained, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/amount-containeds/{id}")
    public ResponseEntity<AmountContained> getAmountContained(@PathVariable Long id) {
        log.debug("REST request to get AmountContained : {}", id);
        Optional<AmountContained> amountContained = amountContainedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(amountContained);
    }

    /**
     * {@code DELETE  /amount-containeds/:id} : delete the "id" amountContained.
     *
     * @param id the id of the amountContained to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/amount-containeds/{id}")
    public ResponseEntity<Void> deleteAmountContained(@PathVariable Long id) {
        log.debug("REST request to delete AmountContained : {}", id);
        amountContainedRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
